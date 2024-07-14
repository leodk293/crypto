import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import logo from '../../assets/logo.png';
import arrow from '../../assets/arrow_icon.png';
import Footer from '../footer/Footer';
import './details.css';

const currencySymbols = {
    usd: '$',
    eur: '€',
    inr: '₹',
};

function CoinDetails() {
    const { coinId } = useParams();
    const [coinDetails, setCoinDetails] = useState({});
    const [currency, setCurrency] = useState('usd');
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': 'CG-gikvCGrX16wwXPrykcCnBYqq',
            },
        };

        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=5`, options)
            .then((response) => response.json())
            .then((response) => {
                const formattedData = [['Date', 'Price']];
                response.prices.forEach((price) => {
                    const date = new Date(price[0]).toLocaleDateString();
                    formattedData.push([date, price[1]]);
                });
                setData(formattedData);
            })
            .catch((err) => {
                console.error(err);
                setError(err);
            });
    }, [coinId, currency]);

    useEffect(() => {
        const fetchCoinDetails = async () => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-cg-demo-api-key': 'CG-gikvCGrX16wwXPrykcCnBYqq',
                },
            };

            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
                const data = await response.json();
                setCoinDetails(data);
            } catch (err) {
                console.error(err);
                setError(err);
            }
        };

        fetchCoinDetails();
    }, [coinId]);

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
                    <select name="currency" id="currency" onChange={handleCurrencyChange} value={currency}>
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

            <section className="details">
                {coinDetails.image && <img src={coinDetails.image.large} alt="COIN IMAGE" />}
                <h1>{coinDetails.name} ({coinDetails.symbol})</h1>

                {data.length > 1 && (
                    <Chart
                        width={'600px'}
                        height={'600px'}
                        chartType="LineChart"
                        loader={<div>Loading Chart...</div>}
                        data={data}
                        options={{
                            title: `${coinId} Price in ${currency}`,
                            hAxis: { title: 'Date' },
                            vAxis: { title: `Price (${currencySymbols[currency]})` },
                            legend: 'none',
                        }}
                    />
                )}

                <div className="details-place">
                    <div className="row">
                        <p>Crypto Market Rank</p>
                        <p>{coinDetails.market_cap_rank}</p>
                    </div>
                    <div className='line-row'></div>
                    {coinDetails.market_data && (
                        <>
                            <div className="row">
                                <p>Current Price</p>
                                <p>{currencySymbols[currency]} {(coinDetails.market_data.current_price[currency]).toLocaleString()}</p>
                            </div>
                            <div className='line-row'></div>
                            <div className="row">
                                <p>Market cap</p>
                                <p>{currencySymbols[currency]} {(coinDetails.market_data.market_cap[currency]).toLocaleString()}</p>
                            </div>
                            <div className='line-row'></div>
                            <div className="row">
                                <p>24 Hour high</p>
                                <p>{currencySymbols[currency]} {(coinDetails.market_data.high_24h[currency]).toLocaleString()}</p>
                            </div>
                            <div className='line-row'></div>
                            <div className="row">
                                <p>24 Hour low</p>
                                <p>{currencySymbols[currency]} {(coinDetails.market_data.low_24h[currency]).toLocaleString()}</p>
                            </div>
                            <div className='line-row'></div>
                        </>
                    )}
                </div>

                {coinDetails.links && coinDetails.links.homepage && (
                    <p>Official <strong> {coinDetails.name} </strong> Website ➡️ : <a style={{ color: "#fff", textDecoration: "none" }} target='_blank' href={coinDetails.links.homepage[0]}>Click Here</a></p>
                )}
            </section>

            <Footer />
        </>
    );
}

export default CoinDetails;
