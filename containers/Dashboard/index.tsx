import * as React from 'react';
import Tinlake from 'tinlake';
import { ApolloClient } from '../../services/apollo';
import { connect } from 'react-redux';
import { Box, Heading } from 'grommet';
import SecondaryHeader from '../../components/SecondaryHeader';
import { DashboardState, subscribeDashboardData } from '../../ducks/dashboard';
import LoanList from '../../components/LoanList';

interface Props {
  tinlake: Tinlake;
  apolloClient: ApolloClient;
  dashboard?: DashboardState;
  subscribeDashboardData?: (tinlake: Tinlake) => () => void;
}

class Dashboard extends React.Component<Props> {

  render() {
    const { tinlake } = this.props;
    return <Box >
      <SecondaryHeader>
        <Box pad={{ horizontal: 'medium', top: 'medium' }}>
          <Heading level="3">Recent Loans</Heading>
        </Box>
      </SecondaryHeader>
      <LoanList tinlake={tinlake} mode="" />
      <Box pad={{ horizontal: 'medium', vertical: 'medium' }}>
      </Box>
    </Box>;
  }
}

export default connect(state => state, { subscribeDashboardData })(Dashboard);
