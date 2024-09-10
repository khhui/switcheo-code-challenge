"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Spinner,
} from "@nextui-org/react";

import Table1 from "../components/table1";
import { tokens } from "./data/data";
export default function Home() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [sendCurrency, setSendCurrency] = useState<string>("");
  const [receiveCurrency, setReceiveCurrency] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<number>();
  const [receiveAmount, setReceiveAmount] = useState<number>();
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    if (!tokens || tokens.length === 0) {
      console.warn("Tokens array is empty or undefined");
      return;
    }

    let currencyCodes = [...new Set(tokens.map((token) => token.currency))];
    setCurrencies(currencyCodes);

    setSendCurrency(currencyCodes[0] || "");
    setReceiveCurrency(currencyCodes[1] || "");
  }, [tokens]);

  const getPrice = (currency: string) => {
    if (!tokens || tokens.length === 0) return 0;

    const currencyData = tokens
      .filter((token) => token.currency === currency && token.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return currencyData.length > 0 && currencyData[0].price
      ? currencyData[0].price
      : 0;
  };

  const sendPrice = getPrice(sendCurrency);
  const receivePrice = getPrice(receiveCurrency);

  useEffect(() => {
    if (sendPrice && receivePrice) {
      setExchangeRate(sendPrice / receivePrice);
    }
  }, [sendCurrency, receiveCurrency]);

  const handleSendAmountChange = (amount: number) => {
    setSendAmount(amount);
    setReceiveAmount(amount * exchangeRate);
  };

  const handleSwapClick = () => {
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
    }, 3000); // 3-second delay for the simulation
  };

  return (
    <section className="flex flex-col md:flex-row items-start gap-8 py-8 md:py-10">
      <section className="flex-1 min-w-[52%]">
        <h1 className="tracking-tight inline font-semibold from-[#FF1CF7] to-[#b249f8] text-[5rem] lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b">
          SWAP
        </h1>
        <Card>
          <CardBody className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">SEND</p>
            </div>
            <section>
              <Input
                placeholder="0.00"
                labelPlacement="outside"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                endContent={
                  <div className="flex items-center">
                    <label className="sr-only" htmlFor="send-currency">
                      Currency
                    </label>
                    <div className="dropdown-header flex items-center cursor-pointer p-2">
                      <Avatar
                        src={`/tokens/${sendCurrency}.svg`}
                        className="w-6 h-6 text-tiny"
                      />
                    </div>

                    <select
                      className="outline-none border-0 bg-transparent text-default-400 text-small"
                      id="send-currency"
                      name="send-currency"
                      // value={sendCurrency}
                      onChange={(e) => setSendCurrency(e.target.value)}
                    >
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                }
                type="number"
                value={sendAmount !== undefined ? sendAmount.toString() : ""} // Convert to string
                onChange={(e) => handleSendAmountChange(Number(e.target.value))}
              />
            </section>
          </CardBody>
          <Divider />
          <CardBody className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">RECEIVE</p>
            </div>
            <section>
              <Input
                placeholder="0.00"
                labelPlacement="outside"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                endContent={
                  <div className="flex items-center">
                    <label className="sr-only" htmlFor="receive-currency">
                      Currency
                    </label>
                    <div className="dropdown-header flex items-center cursor-pointer p-2">
                      <Avatar
                        src={`/tokens/${receiveCurrency}.svg`}
                        className="w-6 h-6 text-tiny"
                      />
                    </div>
                    <select
                      className="outline-none border-0 bg-transparent text-default-400 text-small"
                      id="receive-currency"
                      name="receive-currency"
                      value={receiveCurrency}
                      onChange={(e) => setReceiveCurrency(e.target.value)}
                    >
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                }
                type="number"
                value={
                  receiveAmount !== undefined ? receiveAmount.toString() : ""
                } // Convert to string
                readOnly
              />
            </section>
          </CardBody>
          <CardFooter className="flex justify-between items-center">
            {/* Exchange Rate on the Left */}
            <div className="flex text-small text-default-400 pt-2">
              1 {sendCurrency} = {exchangeRate.toFixed(4)} {receiveCurrency}
            </div>

            {/* Button on the Right */}
            <div className="flex">
              <Button
                onClick={handleSwapClick}
                disabled={isSwapping}
                radius="full"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
              >
                {isSwapping ? "SWAPPED" : "CONFIRM SWAP"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Table Section */}
      <section className="flex-2">
        <h1 className="font-semibold text-[1.5rem] lg:text-2xl">
          EXCHANGE RATES
        </h1>
        <Table1 />
      </section>
    </section>
  );
}
