import * as React from 'react';
import Tinlake from 'tinlake';
import { LoansState, getLoan, subscribeDebt } from '../../ducks/loans';
import { connect } from 'react-redux';
import Alert from '../Alert';
import { Box, Button, Heading, Text, FormField, TextInput } from 'grommet';
import LoanNftData from '../LoanNftData';
import { bnToHex } from '../../utils/bnToHex';
import SecondaryHeader from '../SecondaryHeader';
import Link from 'next/link';
import { LinkPrevious } from 'grommet-icons';
import LoanData from '../LoanData';

const SUCCESS_STATUS = '0x1';

interface Props {
  loanId: string;
  tinlake: Tinlake;
  loans?: LoansState;
  getLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
  subscribeDebt?: (tinlake: Tinlake, loanId: string) => () => void;
}

interface State {
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string;
}

class UnwhitelistNFT extends React.Component<Props, State> {
  state: State = {
    is: null,
    errorMsg: '',
  };
  discardDebtSubscription = () => { };

  componentWillMount() {
    this.props.getLoan!(this.props.tinlake, this.props.loanId);
    this.discardDebtSubscription = this.props.subscribeDebt!(this.props.tinlake, this.props.loanId);
  }

  componentWillUnmount() {
    this.discardDebtSubscription();
  }

  unwhitelist = async () => {
    this.setState({ is: 'loading' });

    const { getLoan, tinlake, loanId } = this.props;
    const addresses = tinlake.contractAddresses;

    try {
      // get loan
      const loan = await tinlake.getLoan(loanId);

      // unwhitelist
      const res1 = await tinlake.unwhitelist(loanId, addresses['NFT_COLLATERAL'],
                                             bnToHex(loan.tokenId));

      console.log('unwhitelist results');
      console.log(res1.txHash);

      if (res1.status !== SUCCESS_STATUS) {
        console.log(res1);
        this.setState({ is: 'error', errorMsg: JSON.stringify(res1) });
        return;
      }

      await getLoan!(tinlake, loanId, true);

      this.setState({ is: 'success' });
    } catch (e) {
      console.log(e);
      this.setState({ is: 'error', errorMsg: e.message });
    }
  }

  render() {
    const { loans, loanId, tinlake } = this.props;
    const { singleLoan, singleLoanState } = loans!;

    if (singleLoanState === null || singleLoanState === 'loading') { return 'Loading...'; }
    if (singleLoanState === 'not found') {
      return <Alert type="error">
        Could not find loan {loanId}</Alert>;
    }

    const { status } = singleLoan!;
    const { is, errorMsg } = this.state;

    return <Box>
      <SecondaryHeader>
        <Box direction="row" gap="small" align="center">
          <Link href={`/admin/loan?loanId=${loanId}`}>
            <LinkPrevious />
          </Link>
          <Heading level="3">Unwhitelist NFT for Loan {loanId}</Heading>
        </Box>

        {status === 'Whitelisted' &&
          <Button primary onClick={this.unwhitelist} label="Confirm"
            disabled={is === 'loading' || is === 'success'} />}
      </SecondaryHeader>

      <Box pad={{ horizontal: 'medium' }}>
        {is === 'loading' && 'Unwhitelisting...'}
        {is === 'success' && <Alert type="success" margin={{ vertical: 'large' }}>
          Successfully unwhitelisted NFT for Loan ID {loanId}</Alert>}
        {is === 'error' && <Alert type="error" margin={{ vertical: 'large' }}>
          <Text weight="bold">
            Error unwhitelisting NFT for Loan ID {loanId}, see console for details</Text>
          {errorMsg && <div><br />{errorMsg}</div>}
        </Alert>}

        <Box direction="row" gap="medium" margin={{ vertical: 'medium', top: 'large' }}>
          <Box basis={'1/4'} gap="medium"><FormField label="Loan ID">
            <TextInput value={loanId} disabled /></FormField></Box>
          <Box basis={'1/4'} gap="medium"><FormField label="Loan Status">
            <TextInput value={status} disabled /></FormField></Box>
          <Box basis={'1/4'} gap="medium" />
          <Box basis={'1/4'} gap="medium" />
        </Box>

        <LoanData loan={singleLoan!} />

        <LoanNftData loan={singleLoan!} authedAddr={tinlake.ethConfig.from} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { getLoan, subscribeDebt })(UnwhitelistNFT);
