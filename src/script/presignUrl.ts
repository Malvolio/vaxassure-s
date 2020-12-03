import url from "url";
import AWS from "aws-sdk";

const s3 = new AWS.S3();
const myBucket = "vaxassure-test-data";
const myKey = "file.html";
const signedUrlExpireSeconds = 60 * 20;

s3.getSignedUrl(
  "putObject",
  {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
    ContentType: "text/html",
    ACL: "public-read",
    CacheControl: "public; max-age=8640000", // 100 days
  },
  (e, u) => {
    const q = url.parse(u, true);

    const headers = q.search
      ?.substring(1)
      .split("&")
      .map((s) => {
        const [k, v] = s.split("=");
        return k === "AWSAccessKeyId"
          ? ""
          : `-H '${k}: ${decodeURIComponent(v)}' `;
      })
      .join("");

    console.log(
      `curl -v -X PUT ${headers} --data '<html>uploaded ${new Date().toString()}</html>' '${u}'`
    );
  }
);
