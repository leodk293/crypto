import React, { useState, useEffect, useRef } from 'react';

import logo from '../../assets/logo.png';
import arrow from '../../assets/arrow_icon.png';

import { Link } from 'react-router-dom';

import cryptocurrencies from './crypto';

import './home.css';
import Footer from '../footer/Footer';

export default function Home() {
    const [currency, setCurrency] = useState('usd');
    const [symbol, setSymbol] = useState('$');
    const [coinData, setCoinData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef();

    const handleCurrencyChange = (event) => {
        const selectedCurrency = event.target.value;
        setCurrency(selectedCurrency);

        let currencySymbol = '$';
        if (selectedCurrency === 'eur') {
            currencySymbol = '€';
        } else if (selectedCurrency === 'inr') {
            currencySymbol = '₹';
        }
        setSymbol(currencySymbol);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const fetchCoinData = async () => {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-gikvCGrX16wwXPrykcCnBYqq' }
        };

        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`, options)
            .then(response => response.json())
            .then(response => {
                setCoinData(response);
                console.log(response);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCoinData();
    }, [currency]);

    const filteredCoins = coinData.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <header>
                <Link to={'/'}>
                    <img src={logo} alt="LOGO" />
                </Link>
                <nav>
                    <ul>
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link>Features</Link></li>
                        <li><Link>Pricing</Link></li>
                        <li><Link>Blog</Link></li>
                    </ul>
                </nav>

                <div className="interactions">
                    <select name="currency" id="currency" onChange={handleCurrencyChange}>
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                        <option value="inr">INR</option>
                    </select>

                    <button className='btn'>
                        <p>Sign up</p>
                        <img src={arrow} alt="ARROW" />
                    </button>
                </div>
            </header>

            <section className="home-page">
                <h1 className='title'>Largest<br /> Crypto Marketplace</h1>
                <p style={{ color: "#f1f1f1", textAlign: "center", lineHeight: "1.5", fontSize: "18px" }}>Welcome to the world's largest cryptocurrency marketplace.<br /> Sign up to explore more about cryptos.</p>
                <form className="input-place">
                    <input
                        ref={inputRef}
                        list='coinlist'
                        type="text"
                        placeholder='Search crypto..'
                        value={searchTerm}
                        onChange={handleSearch}
                        required
                    />
                    <datalist id='coinlist'>
                        {cryptocurrencies.map((cryp, index) => (
                            <option value={cryp.name} key={index} />
                        ))}
                    </datalist>
                    <button type="submit">Search</button>
                </form>

                <div className="coins">
                    <div style={{ backgroundColor: "#240f4f", color: "#fff", borderRadius: "10px 10px 0 0" }} className='structure'>
                        <p>#</p>
                        <p>Coins</p>
                        <p>Price</p>
                        <p style={{ textAlign: "center" }}>24H Change</p>
                        <p className='market-cap'>Market Cap</p>
                    </div>
                    {Array.isArray(filteredCoins) && filteredCoins.slice(0, 10).map((element, index) => (
                        <Link key={index} to={`/coin/${element.id}`}>
                            <div className='structure' key={index}>
                                <p>{element.market_cap_rank}</p>
                                <div className='coins-data'>
                                    <img src={element.image} alt="COIN IMAGE" />
                                    <p>{element.name}-{element.symbol}</p>
                                </div>
                                <p>{symbol} {(element.current_price).toLocaleString()}</p>
                                <p className={Math.floor(element.price_change_percentage_24h * 100) / 100 > 0 ? "green" : "red"} style={{ textAlign: "center" }}>{Math.floor(element.price_change_percentage_24h * 100) / 100}</p>
                                <p className='market-cap'>{symbol} {element.market_cap.toLocaleString()}</p>
                            </div>
                        </Link>
                    ))}

                </div>
            </section>

            <Footer/>
        </>
    );
}
