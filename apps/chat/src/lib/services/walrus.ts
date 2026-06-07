export async function uploadToWalrus(content: string): Promise<string | null> {
  try {
    const response = await fetch("https://publisher.walrus-testnet.walrus.space/v1/store", {
      method: "PUT",
      body: content,
    });

    if (!response.ok) {
      console.error("Walrus upload failed:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    // Walrus returns either newlyCreated or alreadyCertified
    if (data.newlyCreated && data.newlyCreated.blobObject) {
      return data.newlyCreated.blobObject.blobId;
    } else if (data.alreadyCertified) {
      return data.alreadyCertified.blobId;
    }

    return null;
  } catch (error) {
    console.error("Error uploading to Walrus:", error);
    return null;
  }
}
