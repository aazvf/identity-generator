export const useIdentityIndex = () => {
    return useState("identity-index", () => 0);
};

export default function () {
    return useState("identities", () => []);
}
