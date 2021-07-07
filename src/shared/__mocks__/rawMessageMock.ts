const rawData = `
Delivered-To: user+newsletter@gmail.com
Received: by 2002:a05:7110:4214:b029:cd:fa17:aa99 with SMTP id u20csp341950gec;
        Thu, 3 Jun 2021 10:58:28 -0700 (PDT)
X-Received: by 2002:a25:8191:: with SMTP id p17mr429757ybk.405.1622743108072;
        Thu, 03 Jun 2021 10:58:28 -0700 (PDT)
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@gmail.com header.s=20161025 header.b=hvZ6MiAD;
       spf=pass (google.com: domain of sender@company.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=sender@company.com;
       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com
Return-Path: <sender@company.com>
Received: from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])
        by mx.google.com with SMTPS id x1sor1299937ybm.123.2021.06.03.10.58.28
        for <user+newsletter@gmail.com>
        (Google Transport Security);
        Thu, 03 Jun 2021 10:58:28 -0700 (PDT)
Received-SPF: pass (google.com: domain of sender@company.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@gmail.com header.s=20161025 header.b=hvZ6MiAD;
       spf=pass (google.com: domain of sender@company.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=sender@company.com;
       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com
X-Received: by 2002:a25:da8a:: with SMTP id n132mr485019ybf.504.1622743107553;
 Thu, 03 Jun 2021 10:58:27 -0700 (PDT)
MIME-Version: 1.0
From: =?UTF-8?B?QW5kcsOpIEJyYW5kw6Nv?= <sender@company.com>
Date: Thu, 3 Jun 2021 14:58:16 -0300
Message-ID: <CAPdSf7fkq31cUa2spqw9btGYhx3PTZGfn15KiyotKzrhs6+SyA@mail.gmail.com>
Subject: Hello World!
To: user+newsletter@gmail.com
Content-Type: multipart/alternative; boundary="0000000000007ccbc405c3e052b5"

--0000000000007ccbc405c3e052b5
Content-Type: text/plain; charset="UTF-8"

Simple email.

--0000000000007ccbc405c3e052b5
Content-Type: text/html; charset="UTF-8"

<div dir="ltr"><h1 style="color:rgb(0,0,0);font-family:&quot;Times New Roman&quot;">Simple email.</h1></div>

--0000000000007ccbc405c3e052b5--
`.trim();

const rawMessage = {
  id: '180d306c9d93d751',
  threadId: '180d306c9d93d751',
  labelIds: ['UNREAD', 'CATEGORY_PERSONAL', 'INBOX'],
  snippet: 'This is a simple email',
  sizeEstimate: 62682,
  raw: Buffer.from(rawData).toString('base64'),
  historyId: '12345',
  internalDate: '1621695600',
};

export default rawMessage;
