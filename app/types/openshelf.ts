/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/openshelf.json`.
 */
export type Openshelf = {
  "address": "AGVyPYiXUtSnKqqgLWcs5LAfh94ct1CtuaiCSFuGMxxW",
  "metadata": {
    "name": "openshelf",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addBook",
      "discriminator": [
        181,
        117,
        249,
        173,
        108,
        163,
        209,
        238
      ],
      "accounts": [
        {
          "name": "book",
          "writable": true,
          "signer": true
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "genre",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        }
      ]
    },
    {
      "name": "addChapter",
      "discriminator": [
        70,
        219,
        222,
        77,
        39,
        136,
        132,
        233
      ],
      "accounts": [
        {
          "name": "book",
          "writable": true
        },
        {
          "name": "author",
          "writable": true,
          "signer": true,
          "relations": [
            "book"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "chapterUrl",
          "type": "string"
        },
        {
          "name": "chapterIndex",
          "type": "u8"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "claimStakerEarnings",
      "discriminator": [
        117,
        245,
        169,
        16,
        136,
        196,
        36,
        84
      ],
      "accounts": [
        {
          "name": "book",
          "writable": true
        },
        {
          "name": "staker",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createBookAsset",
      "discriminator": [
        63,
        105,
        59,
        78,
        121,
        55,
        218,
        112
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "collection",
          "writable": true
        },
        {
          "name": "book"
        },
        {
          "name": "asset",
          "writable": true,
          "signer": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createChapterAsset",
      "discriminator": [
        234,
        23,
        202,
        174,
        61,
        95,
        91,
        195
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "collection",
          "writable": true
        },
        {
          "name": "book"
        },
        {
          "name": "asset",
          "writable": true,
          "signer": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "chapterIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createUserCollection",
      "discriminator": [
        26,
        51,
        177,
        244,
        95,
        195,
        81,
        131
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "collection",
          "writable": true,
          "signer": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "purchaseChapter",
      "discriminator": [
        123,
        139,
        195,
        216,
        156,
        158,
        134,
        67
      ],
      "accounts": [
        {
          "name": "book",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "author",
          "writable": true
        },
        {
          "name": "platform",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "chapterIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "purchaseFullBook",
      "discriminator": [
        114,
        134,
        89,
        208,
        117,
        183,
        37,
        232
      ],
      "accounts": [
        {
          "name": "book",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "author",
          "writable": true
        },
        {
          "name": "platform",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "stakeOnBook",
      "discriminator": [
        63,
        5,
        158,
        206,
        162,
        224,
        240,
        1
      ],
      "accounts": [
        {
          "name": "book",
          "writable": true
        },
        {
          "name": "staker",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "baseCollectionV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "book",
      "discriminator": [
        121,
        34,
        121,
        35,
        91,
        62,
        85,
        222
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyPurchased",
      "msg": "You have already purchased this chapter or book"
    },
    {
      "code": 6001,
      "name": "notQualifiedForStaking",
      "msg": "You must purchase all chapters or the full book before staking"
    },
    {
      "code": 6002,
      "name": "invalidChapterIndex",
      "msg": "Invalid chapter index"
    },
    {
      "code": 6003,
      "name": "insufficientFunds",
      "msg": "insufficientFunds"
    },
    {
      "code": 6004,
      "name": "stakerNotFound",
      "msg": "Stake not found for this staker"
    },
    {
      "code": 6005,
      "name": "noEarningsToClaim",
      "msg": "No rewards to claim"
    }
  ],
  "types": [
    {
      "name": "baseCollectionV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "key"
              }
            }
          },
          {
            "name": "updateAuthority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "numMinted",
            "type": "u32"
          },
          {
            "name": "currentSize",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "book",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "metadata",
            "type": {
              "defined": {
                "name": "metaData"
              }
            }
          },
          {
            "name": "fullBookPrice",
            "type": "u64"
          },
          {
            "name": "totalStake",
            "type": "u64"
          },
          {
            "name": "chapters",
            "type": {
              "vec": {
                "defined": {
                  "name": "chapter"
                }
              }
            }
          },
          {
            "name": "stakes",
            "type": {
              "vec": {
                "defined": {
                  "name": "stake"
                }
              }
            }
          },
          {
            "name": "readers",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "chapter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "readers",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "key",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "uninitialized"
          },
          {
            "name": "assetV1"
          },
          {
            "name": "hashedAssetV1"
          },
          {
            "name": "pluginHeaderV1"
          },
          {
            "name": "pluginRegistryV1"
          },
          {
            "name": "collectionV1"
          }
        ]
      }
    },
    {
      "name": "metaData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "publishDate",
            "type": "i64"
          },
          {
            "name": "genre",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "stake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "staker",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "earnings",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
