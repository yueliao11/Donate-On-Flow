transaction(name: String, code: String) {
    prepare(signer: AuthAccount) {
        signer.contracts.add(
            name: name,
            code: code.decodeHex(),
            type: nil
        )
    }
}
