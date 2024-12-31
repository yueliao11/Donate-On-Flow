/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CharityProject,
  CharityProjectInterface,
} from "../CharityProject";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DonationReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "MinimumFeePaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetAmount",
        type: "uint256",
      },
    ],
    name: "ProjectCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "MINIMUM_FEE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "targetAmount",
        type: "uint256",
      },
    ],
    name: "createProject",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinimumFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getProjectCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "projectCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "projects",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "targetAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "minimumFee",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isMinimumFeePaid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506113a2806100206000396000f3fe6080604052600436106100705760003560e01c80633bcff3b01161004e5780633bcff3b0146101005780634cd370b91461012b57806357855e0e14610156578063f14faf6f1461018157610070565b8063107046bd1461007557806323c55448146100b957806336fbad26146100d5575b600080fd5b34801561008157600080fd5b5061009c60048036038101906100979190610878565b61019d565b6040516100b09897969594939291906109a0565b60405180910390f35b6100d360048036038101906100ce9190610b61565b61032f565b005b3480156100e157600080fd5b506100ea610628565b6040516100f79190610bec565b60405180910390f35b34801561010c57600080fd5b5061011561062e565b6040516101229190610bec565b60405180910390f35b34801561013757600080fd5b50610140610638565b60405161014d9190610bec565b60405180910390f35b34801561016257600080fd5b5061016b610647565b6040516101789190610bec565b60405180910390f35b61019b60048036038101906101969190610878565b610652565b005b60006020528060005260406000206000915090508060000180546101c090610c36565b80601f01602080910402602001604051908101604052809291908181526020018280546101ec90610c36565b80156102395780601f1061020e57610100808354040283529160200191610239565b820191906000526020600020905b81548152906001019060200180831161021c57829003601f168201915b50505050509080600101805461024e90610c36565b80601f016020809104026020016040519081016040528092919081815260200182805461027a90610c36565b80156102c75780601f1061029c576101008083540402835291602001916102c7565b820191906000526020600020905b8154815290600101906020018083116102aa57829003601f168201915b5050505050908060020154908060030154908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060040160149054906101000a900460ff16908060050154908060060160009054906101000a900460ff16905088565b6000835111610373576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036a90610cb3565b60405180910390fd5b60008251116103b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ae90610d1f565b60405180910390fd5b600081116103fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f190610db1565b60405180910390fd5b662386f26fc100003414610443576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043a90610e1d565b60405180910390fd5b6001600081548092919061045690610e6c565b9190505550604051806101000160405280848152602001838152602001828152602001600081526020013373ffffffffffffffffffffffffffffffffffffffff168152602001600115158152602001662386f26fc10000815260200160011515815250600080600154815260200190815260200160002060008201518160000190816104e29190611060565b5060208201518160010190816104f89190611060565b50604082015181600201556060820151816003015560808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a08201518160040160146101000a81548160ff02191690831515021790555060c0820151816005015560e08201518160060160006101000a81548160ff0219169083151502179055509050506001547f6245d01eb0db8df9242165c3ee1e2324367f93303d7b8f6a86e38a8767e643ae84836040516105d5929190611132565b60405180910390a23373ffffffffffffffffffffffffffffffffffffffff166001547f06af8fc8f6ad5f5847716f01e384ac1401354f504417d739408a26b29d7d2c8760405160405180910390a3505050565b60015481565b6000600154905090565b6000662386f26fc10000905090565b662386f26fc1000081565b60008111801561066457506001548111155b6106a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161069a906111ae565b60405180910390fd5b60008082815260200190815260200160002060040160149054906101000a900460ff16610705576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106fc9061121a565b60405180910390fd5b60003411610748576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161073f906112ac565b60405180910390fd5b60008082815260200190815260200160002060060160009054906101000a900460ff166107aa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107a190611318565b60405180910390fd5b60008060008381526020019081526020016000209050348160030160008282546107d49190611338565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16827f0b5b4c52969ff7329ecf7ee536409fda87812b15a8622bc6e8cdeab3aee14a26346040516108229190610bec565b60405180910390a35050565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b61085581610842565b811461086057600080fd5b50565b6000813590506108728161084c565b92915050565b60006020828403121561088e5761088d610838565b5b600061089c84828501610863565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156108df5780820151818401526020810190506108c4565b60008484015250505050565b6000601f19601f8301169050919050565b6000610907826108a5565b61091181856108b0565b93506109218185602086016108c1565b61092a816108eb565b840191505092915050565b61093e81610842565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061096f82610944565b9050919050565b61097f81610964565b82525050565b60008115159050919050565b61099a81610985565b82525050565b60006101008201905081810360008301526109bb818b6108fc565b905081810360208301526109cf818a6108fc565b90506109de6040830189610935565b6109eb6060830188610935565b6109f86080830187610976565b610a0560a0830186610991565b610a1260c0830185610935565b610a1f60e0830184610991565b9998505050505050505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610a6e826108eb565b810181811067ffffffffffffffff82111715610a8d57610a8c610a36565b5b80604052505050565b6000610aa061082e565b9050610aac8282610a65565b919050565b600067ffffffffffffffff821115610acc57610acb610a36565b5b610ad5826108eb565b9050602081019050919050565b82818337600083830152505050565b6000610b04610aff84610ab1565b610a96565b905082815260208101848484011115610b2057610b1f610a31565b5b610b2b848285610ae2565b509392505050565b600082601f830112610b4857610b47610a2c565b5b8135610b58848260208601610af1565b91505092915050565b600080600060608486031215610b7a57610b79610838565b5b600084013567ffffffffffffffff811115610b9857610b9761083d565b5b610ba486828701610b33565b935050602084013567ffffffffffffffff811115610bc557610bc461083d565b5b610bd186828701610b33565b9250506040610be286828701610863565b9150509250925092565b6000602082019050610c016000830184610935565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610c4e57607f821691505b602082108103610c6157610c60610c07565b5b50919050565b7f5469746c652063616e6e6f7420626520656d7074790000000000000000000000600082015250565b6000610c9d6015836108b0565b9150610ca882610c67565b602082019050919050565b60006020820190508181036000830152610ccc81610c90565b9050919050565b7f4465736372697074696f6e2063616e6e6f7420626520656d7074790000000000600082015250565b6000610d09601b836108b0565b9150610d1482610cd3565b602082019050919050565b60006020820190508181036000830152610d3881610cfc565b9050919050565b7f54617267657420616d6f756e74206d757374206265206772656174657220746860008201527f616e203000000000000000000000000000000000000000000000000000000000602082015250565b6000610d9b6024836108b0565b9150610da682610d3f565b604082019050919050565b60006020820190508181036000830152610dca81610d8e565b9050919050565b7f4d75737420706179206578616374206d696e696d756d20666565000000000000600082015250565b6000610e07601a836108b0565b9150610e1282610dd1565b602082019050919050565b60006020820190508181036000830152610e3681610dfa565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610e7782610842565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610ea957610ea8610e3d565b5b600182019050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302610f167fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610ed9565b610f208683610ed9565b95508019841693508086168417925050509392505050565b6000819050919050565b6000610f5d610f58610f5384610842565b610f38565b610842565b9050919050565b6000819050919050565b610f7783610f42565b610f8b610f8382610f64565b848454610ee6565b825550505050565b600090565b610fa0610f93565b610fab818484610f6e565b505050565b5b81811015610fcf57610fc4600082610f98565b600181019050610fb1565b5050565b601f82111561101457610fe581610eb4565b610fee84610ec9565b81016020851015610ffd578190505b61101161100985610ec9565b830182610fb0565b50505b505050565b600082821c905092915050565b600061103760001984600802611019565b1980831691505092915050565b60006110508383611026565b9150826002028217905092915050565b611069826108a5565b67ffffffffffffffff81111561108257611081610a36565b5b61108c8254610c36565b611097828285610fd3565b600060209050601f8311600181146110ca57600084156110b8578287015190505b6110c28582611044565b86555061112a565b601f1984166110d886610eb4565b60005b82811015611100578489015182556001820191506020850194506020810190506110db565b8683101561111d5784890151611119601f891682611026565b8355505b6001600288020188555050505b505050505050565b6000604082019050818103600083015261114c81856108fc565b905061115b6020830184610935565b9392505050565b7f496e76616c69642070726f6a6563742049440000000000000000000000000000600082015250565b60006111986012836108b0565b91506111a382611162565b602082019050919050565b600060208201905081810360008301526111c78161118b565b9050919050565b7f50726f6a656374206973206e6f74206163746976650000000000000000000000600082015250565b60006112046015836108b0565b915061120f826111ce565b602082019050919050565b60006020820190508181036000830152611233816111f7565b9050919050565b7f446f6e6174696f6e20616d6f756e74206d75737420626520677265617465722060008201527f7468616e20300000000000000000000000000000000000000000000000000000602082015250565b60006112966026836108b0565b91506112a18261123a565b604082019050919050565b600060208201905081810360008301526112c581611289565b9050919050565b7f50726f6a656374206d696e696d756d20666565206e6f74207061696400000000600082015250565b6000611302601c836108b0565b915061130d826112cc565b602082019050919050565b60006020820190508181036000830152611331816112f5565b9050919050565b600061134382610842565b915061134e83610842565b925082820190508082111561136657611365610e3d565b5b9291505056fea2646970667358221220645db7da378387ba349689ea9491c760e94a5a04870e13f51c276457439dd21264736f6c63430008130033";

type CharityProjectConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CharityProjectConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CharityProject__factory extends ContractFactory {
  constructor(...args: CharityProjectConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string }
  ): Promise<CharityProject> {
    return super.deploy(overrides || {}) as Promise<CharityProject>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): CharityProject {
    return super.attach(address) as CharityProject;
  }
  override connect(signer: Signer): CharityProject__factory {
    return super.connect(signer) as CharityProject__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CharityProjectInterface {
    return new utils.Interface(_abi) as CharityProjectInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CharityProject {
    return new Contract(address, _abi, signerOrProvider) as CharityProject;
  }
}
