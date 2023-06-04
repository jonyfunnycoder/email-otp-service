export interface ISendEMailConfType {
  email: string;
  templateName: string;
  subject: string;
  context: {
    [Key: string]: any;
  };
}

export interface ISendOtpEmailResp {
  status: string;
}
