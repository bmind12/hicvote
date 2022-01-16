import React from 'react';
import { Link } from "react-router-dom";
import '../assets/styles/design-tokens.css';
import './header.css';

import { ReactComponent as Logo } from '../assets/icons/hen-vote-logo.svg';

import { SyncMenu } from './SyncMenu';
import { ProposalsNav } from './ProposalsNav';

interface HeaderProps {
  votes: any;
  connected: boolean;
  connect: any;
  disconnect: any;
  activeAccount: any;
}

function shortAddr(address:string){
  return address ?
    address.slice(0,4)+"..."+address.slice(address.length - 4,address.length)
    : ''
}

async function isAdmin(address:string){
  return await fetch(`https://api.${process.env.REACT_APP_NETWORK}.tzkt.io/v1/contracts/${process.env.REACT_APP_CONTRACT_ADDRESS}/storage?path=administrator`)
  .then(response => response.json())
  .then(data => {
    // if address is in response, then it is an admin
    // console.log(data);
    return typeof data[address] === 'object';
  })
  .catch(err => {
    console.log(err);
    return false;
  });
}


export const Header = ({
  votes = 0,
  connect = () => {},
  disconnect = () => {},
  connected = false,
  activeAccount = "",
  ...props
}: HeaderProps) => {
  const addr = activeAccount?shortAddr(activeAccount.address):'';
  const [admin, setAdmin] = React.useState(false);
    React.useEffect(() => {
    if(activeAccount.address){
      isAdmin(activeAccount.address).then((res: boolean) => {
        setAdmin(res);
      });
    }
  }, [activeAccount.address]);
  return (
    <header
      className="appHeader"
      {...props}
    >
      <a href="https://vote.hencommunity.quest" style="color: white;background: black;display: block;padding: 8px 32px;">✨ hen_community Discord naming vote is taking place at vote.hencommunity.quest</a>
      <nav className="appHeader-primaryNav">
        <section className="appHeader-primaryNav-left">
          <div className="appHeader-logo">
            <Link to="/"><Logo/></Link>
          </div>
          <nav className="appHeader-resources">
            <Link to="/about">About</Link>
            <Link to="/faq">FAQ</Link>
            <a target="_blank" rel="noreferrer" href="https://community.hicetnunc.xyz">Forum ↪</a>
          </nav>
        </section>
        <section className="appHeader-primaryNav-right">
          <div className="appHeader-votingStatus">
            <div className="votingStatus">
              <Link to="/profile" className="votingStatus-count">
                Vote Weight: { votes.count }
              </Link>
            </div>
          </div>
          <Link to='/profile' className="appHeader-walletAddress">
            {addr}
          </Link>
          <SyncMenu 
            admin={activeAccount.address === process.env.REACT_APP_ADMIN || admin}
            connect={connect}
            disconnect={disconnect}
            connected={connected}
            activeAccount={activeAccount}
            addr={addr}
          />
        </section>
      </nav>
      <ProposalsNav className="appHeader-proposalsNav" />
    </header>
  );
};
