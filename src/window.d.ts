interface Window {
    usr: {
        name?: string,
        id?: string
    },
    app: {
        tableName: string
    },
    ddb: DynamoDBDocumentClient,
    logOut: () => void
}
