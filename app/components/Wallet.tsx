"use client";
import { useEffect, useState } from "react";
import { Button, TextField, Typography, styled } from "@mui/material";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletPage = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [ethBalance, setEthBalance] = useState<string>("");
  const [bnbBalance, setBnbBalance] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setWalletAddress(accounts[0]);
          const ethBalance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          });
          setEthBalance(ethBalance);

          const web3 = new Web3("https://bsc-dataseed.binance.org/");
          const bnbBalance = await fetchBnbBalance(accounts[0], web3);
          setBnbBalance(bnbBalance);
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchData();
  }, []);

  async function fetchBnbBalance(walletAddress: string, web3: any) {
    try {
      const bnbBalance = await web3.eth.getBalance(walletAddress);
      return web3.utils.fromWei(bnbBalance, "ether");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const handleSendTransaction = async () => {
    if (window.ethereum) {
      try {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: walletAddress,
              to: recipientAddress,
              value: "0x1000",
            },
          ],
        });
        console.log(txHash);
        setRecipientAddress("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Main>
        <Section>
          <WalletAdress variant="h4">Адрес кошелька:</WalletAdress>
          <Value variant="h6">{walletAddress}</Value>
        </Section>

        <Article>
          <Section>
            <Balance variant="h5">Баланс ETH:</Balance>
            <Value variant="h6">{ethBalance}</Value>
          </Section>

          <Section>
            <Balance variant="h5">Баланс BNB:</Balance>
            <Value variant="h6">{bnbBalance}</Value>
          </Section>
        </Article>

        <SecondSection>
          <TextField
            label="Адрес получателя"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <Button variant="contained" onClick={handleSendTransaction}>
            Отправить транзакцию
          </Button>
        </SecondSection>
      </Main>
    </Container>
  );
};

export default WalletPage;

const Container = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;

  @media (max-width: 360px) {
    display: block;
  }
`;

const Main = styled("main")`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  width: 60vw;
  background-color: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 360px) {
    width: 30rem;
  }
`;

const Section = styled("section")`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 360px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Article = styled("article")`
  display: flex;
  gap: 10rem;
  align-items: center;

  @media (max-width: 550px) {
    gap: 3rem;
  }
`;

const Balance = styled(Typography)`
  color: orange;
  font-weight: 800;
`;

const WalletAdress = styled(Typography)`
  color: #1f4a7f;

  @media (max-width: 550px) {
    font-size: 1.5rem;
  }
`;

const SecondSection = styled("section")`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Value = styled(Typography)`
  color: #3f6319;

  @media (max-width: 740px) {
    font-size: 1rem;
  }

  @media (max-width: 550px) {
    font-size: 0.7rem;
  }
`;
