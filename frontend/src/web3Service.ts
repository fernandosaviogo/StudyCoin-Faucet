import Web3 from "web3";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export async function mint() {

    // Trava para acesso sequenciado no mint
    const nextMint = localStorage.getItem("nextMint");
    if(nextMint && parseInt(nextMint) > Date.now())
        throw new Error(`You cannot mint twice a day. Try again tomorrow.`);

    if(!window.ethereum) throw new Error(`No MetaMask found!`);

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if(!accounts || !accounts.length) throw new Error(`No account allowed!`);

    // Levantamento de dados para verificação para impedir acesso seguenciado no mint
    localStorage.setItem("wallet", accounts[0]);
    localStorage.setItem("nextMint", `${Date.now() + (1 * 24 * 60 * 60 * 1000)}`);

    const response = await axios.post(`${API_URL}/mint/${accounts[0]}`);

    return response.data;
}