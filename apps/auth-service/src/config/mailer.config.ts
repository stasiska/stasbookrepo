import { isDev } from "../libs/common/utils/is-dev.util";
import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = async (
    congigService: ConfigService
): Promise<MailerOptions> => ({
    transport: {
        host: 'localhost',
        port: 1025,
        secure: false,
        // auth: {
        //     user: null, не нужно для mailhog
        //     pass: null,
        // }

    },
    defaults: {
        from: `"No Reply" <no-reply@mailhog.test>`

    }
})