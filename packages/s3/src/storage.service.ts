import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    PutObjectCommandInput,
    DeleteObjectCommandInput,
  } from '@aws-sdk/client-s3';
  
  export class S3Service {
    private readonly client: S3Client;
    private readonly bucket: string;
  
    constructor(options: {
      endpoint: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
      bucket: string;
    }) {
      const { endpoint, region, accessKeyId, secretAccessKey, bucket } = options;
  
      this.client = new S3Client({
        endpoint: endpoint,
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });
  
      this.bucket = bucket;
    }
  
    async upload(buffer: Buffer, key: string, mimetype: string) {
      const command: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: String(key),
        Body: buffer,
        ContentType: mimetype,
      };
  
      return this.client.send(new PutObjectCommand(command));
    }
  
    async remove(key: string) {
      const command: DeleteObjectCommandInput = {
        Bucket: this.bucket,
        Key: String(key),
      };
  
      return this.client.send(new DeleteObjectCommand(command));
    }
  
    ping() {
      
      return `poing`;
    }
  }
  