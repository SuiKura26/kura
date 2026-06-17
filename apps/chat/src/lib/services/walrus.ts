export async function uploadToWalrus(content: string): Promise<string | null> {
  try {
    const publisherUrl = process.env.WALRUS_PUBLISHER_URL || "https://publisher.walrus-testnet.walrus.space";
    const response = await fetch(`${publisherUrl}/v1/blobs?epochs=5`, {
      method: "PUT",
      body: content,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Walrus upload failed (${response.status}):`, errText);
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
