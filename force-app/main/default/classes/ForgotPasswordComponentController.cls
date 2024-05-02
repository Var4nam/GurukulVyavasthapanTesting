public class ForgotPasswordComponentController {

    /*@AuraEnabled
    public static String resetPassword(String teacherEmail) {
        Map<String, Object> result = new Map<String, Object>();
        Teacher__c teachers = [SELECT Id, Name, Teacher_SN__c, Email__c FROM Teacher__c WHERE Email__c = :teacherEmail LIMIT 1];
        
        if (teachers != null) {
            Integer verificationCode = generateVerificationCode();
            sendResetEmail(teachers.Email__c, teachers.Name, verificationCode);
            result.put('verificationCode', verificationCode);
            result.put('Teacher_SN__c', teachers.Teacher_SN__c);
        }
        
        return JSON.serialize(result);
    }
    
    private static Integer generateVerificationCode() {
        return (Integer)(Math.random() * 900000) + 100000;
    }
    
    private static void sendResetEmail(String recipientEmail, String name, Integer verificationCode) {
        List<OrgWideEmailAddress> lstEmailAddress=[SELECT Id, DisplayName FROM OrgWideEmailAddress WHERE DisplayName = 'HR Portal'];
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.setOrgWideEmailAddressId(lstEmailAddress[0].Id);
        message.toAddresses = new String[] { recipientEmail };
            message.subject = 'Password Reset Notification';
        
        String emailBody = 'Hi ' + name + ',\n\n'
            + 'Your verification code for resetting your password is: ' + verificationCode + '\n\n'
            + 'Please enter this code to reset your password.\n\n'
            + 'If you did not request a password reset, please ignore this email.\n\n'
            + 'Thank you,\nAiFLY Technology Solutions Pvt. Ltd.';
        
        message.plainTextBody = emailBody;
        
        List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage> { message };
            List<Messaging.SendEmailResult> results = Messaging.sendEmail(messages);
        
        if (results[0].success) {
            System.debug('Email sent successfully.');
        } else {
            System.debug('Email failed to send: ' + results[0].errors[0].message);
        }
    }
    
    @AuraEnabled
    public static Boolean forgetPassword(String teacherId, String newPassword) {
        Teacher__c  teacherUpdatePassword = [SELECT Id, Teacher_SN__c, Password__c FROM Teacher__c WHERE Teacher_SN__c = :teacherId LIMIT 1];
        
        if (teacherUpdatePassword != null) {
            teacherUpdatePassword.Password__c = newPassword;
            UPDATE teacherUpdatePassword;
            return true;
        } else {
            return false;
        }
    }
    
    public class ResetPasswordResponse {
        @AuraEnabled
        public Integer verificationCode { get; set; }
        @AuraEnabled
        public String teacherId { get; set; }
    }*/
}