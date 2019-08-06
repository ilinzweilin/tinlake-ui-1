import * as React from 'react';
import { InternalSingleLoan } from '../../ducks/loans';
import { Box, FormField, TextInput, Heading, Paragraph } from 'grommet';
import styled from 'styled-components';
import { formatAddress } from '../../utils/formatAddress';
import MeBadge from '../MeBadge';
import { NFT } from '../../ducks/nft';
// import NftDataField, { FieldDefinition } from '../NftDataField';
// import nftDataFieldDefinitions from '../../nft_data_field_definitions.json';

interface Props {
  data: InternalSingleLoan | NFT;
  authedAddr: string;
}

interface NftData {
  amount: string;
  asis_value: string;
  rehab_value: string;
  document_version: string;
  loan_size: string;
  advance_rate: string;
  loan_maturity: string;
  risk_rating: string;
  borrower: string;
}

class NftData extends React.Component<Props> {
  render() {
    const { data: { tokenId, nftOwner }, authedAddr } = this.props;
    console.log(this.props)
    // create empty boxes for layout purposes if nft data has != 4 entries
    // const nftDataFillers = [...Array(nftDataFillersNeeded(nftDataFieldDefinitions.length)).keys()];

    return <NftDataContainer>
      <Heading level="6" margin="none">NFT Data</Heading>
      <Box direction="row" gap="medium" margin={{ bottom: 'large', top: 'medium' }}>
        <Box basis={'1/4'} gap="medium"><FormField label="NFT ID">
          <TextInput value={formatAddress(tokenId.toString())} disabled
            title={tokenId.toString()}/></FormField></Box>
        <Box basis={'1/4'} gap="medium">
          <FormField label="NFT Owner" style={{ position: 'relative' }}>
            <TextInput value={formatAddress(nftOwner)} disabled title={nftOwner} />
            {authedAddr === nftOwner &&
              <MeBadge style={{ position: 'absolute', left: 100, top: 32 }} />}
          </FormField>
        </Box>
        <Box basis={'1/4'} gap="medium" />
        <Box basis={'1/4'} gap="medium" />
      </Box>

      <Paragraph>The following metadata was read from the NFT:</Paragraph>
      <Box direction="row" gap="medium" margin={{ bottom: 'none', top: 'small' }}>
        {/*{nftDataFieldDefinitions.map((fieldDef: FieldDefinition) =>*/}
          {/*<Box basis={'1/4'} gap="medium" key={fieldDef.key}>*/}
            {/*/!*<NftDataField fieldDefinition={fieldDef} value={nftData[fieldDef.key]} />*!/*/}
          {/*</Box>,*/}
        {/*)}*/}
        {/*{nftDataFillers.map(i => <Box key={i} basis={'1/4'} gap="medium" />)}*/}
      </Box>
    </NftDataContainer>;
  }
}

export default NftData;

const NftDataContainer = styled(Box)`
  margin: 56px 0;
  padding: 20px;
  border-radius: 3px;
  background: #f7f7f7;
`;

// const nftDataFillersNeeded = (noOfFields: number) => {
//   const remainder = noOfFields % 4;
//   if (remainder === 0) { return 0; }
//   return 4 - remainder;
// };
