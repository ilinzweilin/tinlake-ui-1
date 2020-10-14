import * as React from 'react'
import WithTinlake from '../../../../../components/WithTinlake'
import { Box } from 'grommet'
import MintNFT from '../../../../../components/MintNFT'
import Header from '../../../../../components/Header'
import { menuItems } from '../../../../../menuItems'
import WithFooter from '../../../../../components/WithFooter'
import config, { Pool } from '../../../../../config'
import { WithRouterProps } from 'next/dist/client/with-router'
import { GetStaticProps } from 'next'
import Auth from '../../../../../components/Auth'
import Container from '../../../../../components/Container'
import Head from 'next/head'

interface Props extends WithRouterProps {
  root: string
  pool: Pool
}

class MintNFTPage extends React.Component<Props> {
  render() {
    const { pool } = this.props

    return (
      <WithFooter>
        <Head>
          <title>Mint NFT: {pool.name} | Tinlake | Centrifuge</title>
        </Head>
        <Header poolTitle={pool.shortName || pool.name} selectedRoute={'/demo/mint-nft'} menuItems={menuItems} />
        <Container>
          <Box justify="center" direction="row">
            <Box width="xlarge">
              <WithTinlake
                version={pool.version}
                addresses={pool.addresses}
                contractConfig={pool.contractConfig}
                render={(tinlake) => <Auth tinlake={tinlake} render={() => <MintNFT tinlake={tinlake} />} />}
              />
            </Box>
          </Box>
        </Container>
      </WithFooter>
    )
  }
}

export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  const paths = config.pools.map((pool) => ({ params: { root: pool.addresses.ROOT_CONTRACT, slug: pool.slug } }))

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { root: params?.root, pool: config.pools.find((p) => p.addresses.ROOT_CONTRACT === params?.root) } }
}

export default MintNFTPage