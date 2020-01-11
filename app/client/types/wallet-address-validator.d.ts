declare module "wallet-address-validator" {
  declare class WAValidator {
    static validate(address: string, currency: string = "bitcoin", networkType: string = "prod");
  }

  export default WAValidator;
}
