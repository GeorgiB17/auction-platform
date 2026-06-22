import { Client } from "ldapts";

export async function auth(username, password) {
  const client = new Client({
    url: "ldap://ldap1.hdm-stuttgart.de",
  });

  const userDn = `uid=${username},ou=userlist,dc=hdm-stuttgart,dc=de`;

  try {
    // Login prüfen (Bind)
    await client.bind(userDn, password);

    // User-Daten holen
    const { searchEntries } = await client.search(
      "dc=hdm-stuttgart,dc=de",
      {
        scope: "sub",
        filter: `(uid=${username})`,
        attributes: ["cn", "mail", "uid", "hdmCategory", "homeDirectory"],
      }
    );

    return searchEntries[0]; // dein User
  } catch (err) {
    console.error("LDAP Fehler:", err);
    return null;
  } finally {
    await client.unbind();
  }
}