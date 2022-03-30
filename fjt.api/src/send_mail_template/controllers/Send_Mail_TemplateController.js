const { COMMON } = require('../../constant');
const _ = require('lodash');

module.exports = {

    setandSendMailTemplate: (req, sendMailDetails) => {
        const mailBody = '';
        const mailSubject = '';
        const { Agreement } = req.app.locals.models;
        return Agreement.findOne({
            where: {
                agreementTypeID: sendMailDetails.AgreementTypeID,
                isPublished: true
            },
            order: [['version', 'DESC']]
        }).then((agreementTemplate) => {
            if (!agreementTemplate) {
                return false;
            }
            let agreementTemplateDet = null;
            agreementTemplateDet = agreementTemplate.dataValues;
            sendMailDetails.mailSubject = agreementTemplateDet.agreementSubject ? agreementTemplateDet.agreementSubject : mailSubject;
            sendMailDetails.mailBody = agreementTemplateDet.agreementContent ? agreementTemplateDet.agreementContent : mailBody;
            if (agreementTemplateDet.system_variables) {
                sendMailDetails.systemVariables = agreementTemplateDet.system_variables.toString().split(',');
                if (sendMailDetails.systemVariables.length > 0) {
                    sendMailDetails = module.exports.replaceMailContent(sendMailDetails);
                }
            }

            const channel = global.Emailchannel;
            const queue = COMMON.MailServiceUsed.QueueName;
            channel.assertQueue(queue, { durable: false, autoDelete: false, exclusive: false });
            // Note: on Node 6 Buffer.from(msg) should be used
            const mailObj = {
                To: sendMailDetails.ToEmailAddress,
                Subject: sendMailDetails.mailSubject,
                Body: sendMailDetails.mailBody,
                mailSendProviderType: COMMON.MailServiceUsed.Name,
                CC: sendMailDetails.CC ? sendMailDetails.CC : null,
                BCC: sendMailDetails.BCC ? sendMailDetails.BCC : null
                // BackupAttachment: sendMailDetails.file ? sendMailDetails.file : null,
                // AttachmentName: sendMailDetails.fileName ? sendMailDetails.fileName : null
            };
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(mailObj)));
            return true;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return false;
        });
    },

    replaceMailContent: (sendMailDetails) => {
        _.each(sendMailDetails.systemVariables, (sysvar) => {
            const sysVarUsed = sysvar.trim();
            switch (sysVarUsed) {
                case COMMON.MailTemplate_SystemVariables.userNameHtmlTag:
                    {
                        sendMailDetails.mailBody = sendMailDetails.mailBody.replace(new RegExp(COMMON.MailTemplate_SystemVariables.userNameHtmlTag, 'g'), sendMailDetails.UserName);
                        sendMailDetails.mailSubject = sendMailDetails.mailSubject.replace(new RegExp(COMMON.MailTemplate_SystemVariables.userNameHtmlTag, 'g'), sendMailDetails.UserName);
                        break;
                    }
                case COMMON.MailTemplate_SystemVariables.companyNameHtmlTag:
                    {
                        sendMailDetails.mailBody = sendMailDetails.mailBody.replace(new RegExp(COMMON.MailTemplate_SystemVariables.companyNameHtmlTag, 'g'), COMMON.CompanyName);
                        sendMailDetails.mailSubject = sendMailDetails.mailSubject.replace(new RegExp(COMMON.MailTemplate_SystemVariables.companyNameHtmlTag, 'g'), COMMON.CompanyName);
                        break;
                    }
                case COMMON.MailTemplate_SystemVariables.linkURLHtmlTag:
                    {
                        sendMailDetails.mailBody = sendMailDetails.mailBody.replace(new RegExp(COMMON.MailTemplate_SystemVariables.linkURLHtmlTag, 'g'), sendMailDetails.LinkURL);
                        break;
                    }
                case COMMON.MailTemplate_SystemVariables.companyLogoHtmlTag:
                    {
                        sendMailDetails.mailBody = sendMailDetails.mailBody.replace(new RegExp(COMMON.MailTemplate_SystemVariables.companyLogoHtmlTag, 'g'), sendMailDetails.CompanyLogo);
                        break;
                    }
                case COMMON.MailTemplate_SystemVariables.assemblyNameHtmlTag:
                    {
                        sendMailDetails.mailBody = sendMailDetails.mailBody.replace(new RegExp(COMMON.MailTemplate_SystemVariables.assemblyNameHtmlTag, 'g'), sendMailDetails.assemblyName);
                        sendMailDetails.mailSubject = sendMailDetails.mailSubject.replace(new RegExp(COMMON.MailTemplate_SystemVariables.assemblyNameHtmlTag, 'g'), sendMailDetails.assemblyName);
                        break;
                    }
                case COMMON.MailTemplate_SystemVariables.customerCompanyNameHtmlTag:
                    {
                        sendMailDetails.mailBody = sendMailDetails.mailBody.replace(new RegExp(COMMON.MailTemplate_SystemVariables.customerCompanyNameHtmlTag, 'g'), sendMailDetails.customerCompanyName);
                        sendMailDetails.mailSubject = sendMailDetails.mailSubject.replace(new RegExp(COMMON.MailTemplate_SystemVariables.customerCompanyNameHtmlTag, 'g'), sendMailDetails.customerCompanyName);
                        break;
                    }
                default:
                    break;
            }
        });
        return sendMailDetails;
    }
};