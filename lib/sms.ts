import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendAppointmentReminder(phone: string, appointmentDate: Date, serviceName: string) {
  if (!accountSid || !authToken || !twilioPhone) {
    console.error('Twilio credentials are not configured');
    return;
  }

  try {
    const message = await client.messages.create({
      body: `Randevu Hatırlatması: ${serviceName} hizmeti için randevunuz ${appointmentDate.toLocaleString('tr-TR')} tarihinde.`,
      from: twilioPhone,
      to: phone,
    });

    console.log('SMS sent successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
} 