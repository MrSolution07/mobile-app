import assets from "./assets";

const Collection1 = {
  name: "Abstract Art Collection",
  image: assets.nft03, 
  nfts: [
    {
      id: "NFT-01",
      name: "Abstracto #312",
      creator: "Putri Intan",
      price: 4.25,
      description:
        "The action painter abstract expressionists were directly influenced by automatism. Pollock channelled this into producing gestural...",
      image: assets.nft01,
      bids: [
        {
          id: "BID-11",
          name: "Jessica Tan",
          price: 4.25,
          image: assets.person02,
          date: "December 12, 2019 at 12:10 PM",
        },
        {
          id: "BID-12",
          name: "Jennifer Sia",
          price: 4.5,
          image: assets.person03,
          date: "December 27, 2019 at 1:50 PM",
        },
      ],
    },
    {
      id: "NFT-02",
      name: "Green Coins",
      creator: "Siti Nurhaliza",
      price: 7.25,
      description:
        "The action painter abstract expressionists were directly influenced by automatism...",
      image: assets.nft02,
      bids: [
        {
          id: "BID-21",
          name: "Jessica Tan",
          price: 7.05,
          image: assets.person04,
          date: "December 12, 2019 at 12:10 PM",
        },
      ],
    },
    {
      id: "NFT-03",
      name: "NFT Coins Race",
      creator: "Elisabeth Aho",
      price: 95.25,
      description:
        "The action painter abstract expressionists were directly influenced by automatism...",
      image: assets.nft03,
      bids: [
        {
          id: "BID-31",
          name: "Jessica Tan",
          price: 95.25,
          image: assets.person02,
          date: "December 12, 2019 at 12:10 PM",
        },
      ],
    },
  ],
};

const Collection2 = {
  name: "Modern NFT Collection",
  image: assets.nft06, // Example image for the collection
  nfts: [
    {
      id: "NFT-04",
      name: "Nifty NFT",
      creator: "Putri Intan",
      price: 54.25,
      description:
        "The action painter abstract expressionists were directly influenced by automatism...",
      image: assets.nft04,
      bids: [
        {
          id: "BID-41",
          name: "Jessica Tan",
          price: 56.25,
          image: assets.person02,
          date: "December 12, 2019 at 12:10 PM",
        },
      ],
    },
    {
      id: "NFT-05",
      name: "Colorful Circles",
      creator: "David Doe",
      price: 10.25,
      description:
        "The action painter abstract expressionists were directly influenced by automatism...",
      image: assets.nft05,
      bids: [
        {
          id: "BID-51",
          name: "Jessica Tan",
          price: 10.25,
          image: assets.person02,
          date: "December 12, 2019 at 12:10 PM",
        },
      ],
    },
    {
      id: "NFT-06",
      name: "Black Box Model",
      creator: "Leo Messi",
      price: 20.25,
      description:
        "The action painter abstract expressionists were directly influenced by automatism...",
      image: assets.nft06,
      bids: [
        {
          id: "BID-61",
          name: "Jessica Tan",
          price: 20.25,
          image: assets.person02,
          date: "December 12, 2019 at 12:10 PM",
        },
      ],
    },
  ],
};

const Collection3 = {
  name: "Soulful Abstract Art",
  image: assets.nft07, // Example image for the collection
  nfts: [
    {
      id: "NFT-07",
      name: "Abstracto Soulful Art",
      creator: "Victor de la Cruz",
      price: 18.25,
      description:
        "The action painter abstract expressionists were directly influenced by automatism...",
      image: assets.nft07,
      bids: [],
    },
    // Add 2 more NFTs if available
  ],
};

export { Collection1, Collection2, Collection3 };
