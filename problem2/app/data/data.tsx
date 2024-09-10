import React from "react";

const tokens: any[] = [];

// Function to fetch and process data
const fetchData = async () => {
  try {
    const response = await fetch("https://interview.switcheo.com/prices.json");
    const data: any[] = await response.json();

    const map = new Map<string, { total: number; count: number }>();

    // Process item in data
    data.forEach((item) => {
      const key = `${item.currency}-${item.date}`;

      if (!map.has(key)) {
        map.set(key, { total: item.price, count: 1 });
      } else {
        const current = map.get(key)!;
        current.total += item.price;
        current.count += 1;
      }
    });

    // Convert map to array of tokens with average prices
    const processedTokens: any[] = Array.from(map.entries()).map(
      ([key, value]) => {
        const [currency, date] = key.split("-");
        return {
          currency,
          date: new Date(date).toString(),
          price: value.total / value.count,
        };
      }
    );

    // Update tokens array
    tokens.push(...processedTokens);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();

export { tokens };
