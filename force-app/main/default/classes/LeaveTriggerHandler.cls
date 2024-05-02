public class LeaveTriggerHandler {
    
    public static void sendLeaveEmails(List<Leave__c> leaveList) {
        
        Map<String, Teacher__c> teacherIdToTeacherMap = new Map<String, Teacher__c>();
        Map<String, String> teacherIdVsLeaveIdMap = new Map<String, String>();
        Set<String> teacherEmailsToQuery = new Set<String>();
        Map<Id, List<String>> leaveIdToCCEmailMap = new Map<Id, List<String>>();
        
        List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
        
        for (Leave__c leave : leaveList) {
            if (leave.To__c != null) {
                teacherEmailsToQuery.add(leave.To__c);
            }
            if (leave.Multi_Select_Teacher__c != null) {
                teacherEmailsToQuery.add(leave.Multi_Select_Teacher__c);
            }
            if(leave.CC__c != null) {
                List<String> ccTeacherIds = leave.CC__c.Split(',');
                for (String ccIdentifier : ccTeacherIds) {
                    teacherIdVsLeaveIdMap.put(ccIdentifier.substringBetween('(', ')'), leave.Id);
                }
            }
        }
        
        System.debug('teacherEmailsToQuery ::: '+teacherEmailsToQuery);
        System.debug('teacherIdVsLeaveIdMap ::: '+teacherIdVsLeaveIdMap);
        
        for(Teacher__c onbjTea : [SELECT Id, Email__c, Teacher_SN__c FROM Teacher__c WHERE Teacher_SN__c IN : teacherIdVsLeaveIdMap.KeySet()]) {
            if(!leaveIdToCCEmailMap.ContainsKey((teacherIdVsLeaveIdMap.get(onbjTea.Teacher_SN__c)))) {
                leaveIdToCCEmailMap.put(teacherIdVsLeaveIdMap.get(onbjTea.Teacher_SN__c), new List<String>{onbjTea.Email__c});
            }
            else {
                List<String> lstTea = leaveIdToCCEmailMap.get(teacherIdVsLeaveIdMap.get(onbjTea.Teacher_SN__c));
                lstTea.add(onbjTea.Email__c);
                leaveIdToCCEmailMap.put((teacherIdVsLeaveIdMap.get(onbjTea.Teacher_SN__c)), lstTea);
            }
        }
        
        System.debug('leaveIdToCCEmailMap ::: '+leaveIdToCCEmailMap);
        
        for (Teacher__c teacher : [SELECT Id, Name, Email__c, Teacher_SN__c FROM Teacher__c WHERE Id IN :teacherEmailsToQuery]) {
            teacherIdToTeacherMap.put(teacher.Id, teacher);
        }
        
        System.debug('teacherIdToTeacherMap ::: '+teacherIdToTeacherMap);
        
        for (Leave__c leave : leaveList) {
            if(leave != Null){
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            String teacherName  = teacherIdToTeacherMap.get(leave.To__c).Name;
            String uniqueId = teacherIdToTeacherMap.get(leave.Multi_Select_Teacher__c).Teacher_SN__c;
            
            DateTime fromDateTim = DateTime.newInstance(leave.From_Date__c.year(), leave.From_Date__c.month(), leave.From_Date__c.day());
            String formattedDateForFrom = fromDateTim.format('dd-MMM-yy');
            
            DateTime toDateTim = DateTime.newInstance(leave.To_Date__c.year(), leave.To_Date__c.month(), leave.To_Date__c.day());
            String formattedDateForTo = toDateTim.format('dd-MMM-yy');
            String emailBody = 'Hi '+teacherName+',<br><br>';
            teacherName  = teacherIdToTeacherMap.get(leave.Multi_Select_Teacher__c).Name;
            String siteLink = 'https://bemee--edu360sbx.sandbox.my.site.com/s/';
            
            emailBody += teacherName + ' [' + uniqueId + '] has applied for leave.<br> Please log on to ' +siteLink+' and review the leave application.<br>'
                + 'Following are the applied leave details:<br><br>'
                + '<b>Leave type:</b> ' + leave.Leave_Type__c + '<br>'
                + '<b>From Date:</b> ' + formattedDateForFrom + '<br>'
                + '<b>To Date:</b> ' + formattedDateForTo + '<br>'
                + '<b>Number of days:</b> ' + leave.Leave_Days__c + '<br>'
                + '<b>Reason:</b><br>'+leave.Reason__c + '<br>'
                + '<b>From Session:</b> ' + leave.Sessions__c + '<br>'
                //+ '<b>To Session:</b> ' + leave.Sessions1__c + '<br><br>'
                + siteLink
                + ' to approve/reject this request.';
            emailBody += '<br><br>Regards,<br>Gurukul Vyavasthapan';
            //emailBody += '<br><br>Note: This is an auto-generated mail. Please do not reply.';
            emailBody += '<br> ' + 'This e-mail is generated from ' +siteLink;
            
            if (leave.To__c != null) {
                email.setToAddresses(new String[]{teacherIdToTeacherMap.get(leave.To__c).Email__c});
                //email.setToAddresses(new String[]{'raju@aifly.io'});
            }
            
            if (leaveIdToCCEmailMap.containsKey(leave.Id)) {
                List<String> ccEmails = new List<String>();
                for (String ccIdentifier : leaveIdToCCEmailMap.get(leave.Id)) {
                    ccEmails.addAll(ccIdentifier.split(','));
                }
                email.setCcAddresses(ccEmails);
            }
            
            email.setSubject('Leave Request');
            email.setHtmlBody(emailBody);
            emailList.add(email);
        }
        
        System.debug('emailList ::: '+emailList);
        
        if (!emailList.isEmpty()) {
            Messaging.sendEmail(emailList);
        }
      }
    }
    
    public static void updateTeacherTotalLeave(List<Leave__c> leaveList) {
        
        Set<Id> teacherIds = new Set<Id>();
        for (Leave__c leave : leaveList) {
            if (leave.Multi_Select_Teacher__c != null) {
                teacherIds.add(leave.Multi_Select_Teacher__c);
            }
        }
        
        List<Teacher__c> totalLeavesToUpdate = new List<Teacher__c>();
        
        for (AggregateResult aggResult : [SELECT Multi_Select_Teacher__c, COUNT(Id) leaveCount FROM Leave__c WHERE Multi_Select_Teacher__c IN :teacherIds GROUP BY Multi_Select_Teacher__c]) {
            Id teacherId = (Id)aggResult.get('Multi_Select_Teacher__c');
            Integer leaveCount = (Integer)aggResult.get('leaveCount');
            
            totalLeavesToUpdate.add(new Teacher__c(Id = teacherId, Total__c = leaveCount));
        }
        
        if (!totalLeavesToUpdate.isEmpty()) {
            update totalLeavesToUpdate;
        }
    }
    
    public static void handleLeaveChanges(List<Leave__c> newLeaves, Map<Id, Leave__c> oldLeaves) {
        List<Leave__c> approvedOrRejectedLeaves = new List<Leave__c>();
        
        for (Leave__c newLeave : newLeaves) {
            Leave__c oldLeave = oldLeaves.get(newLeave.Id);
            
            if ((newLeave.Status__c == 'Approved' || newLeave.Status__c == 'Rejected') &&
                (oldLeave.Status__c != 'Approved' && oldLeave.Status__c != 'Rejected')) {
                    approvedOrRejectedLeaves.add(newLeave);
                }
        }
        
        if (!approvedOrRejectedLeaves.isEmpty()) {
            sendLeaveApprovalEmails(approvedOrRejectedLeaves);
        }
    }
    
    private static void sendLeaveApprovalEmails(List<Leave__c> leaves) {
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        
        Set<Id> teacherIds = new Set<Id>();
        for (Leave__c leave : leaves) {
            teacherIds.add(leave.Multi_Select_Teacher__c);
        }
        
        Map<Id, Teacher__c> teacherMap = new Map<Id, Teacher__c>([SELECT Id, Email__c FROM Teacher__c WHERE Id IN :teacherIds]);
        
        for (Leave__c leave : leaves) {
            Teacher__c teacher = teacherMap.get(leave.Multi_Select_Teacher__c);
            
            if (teacher != null && teacher.Email__c != null) {
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setToAddresses(new List<String>{teacher.Email__c});
                email.setSubject('Leave '+ leave.Status__c +' Notification');
                email.setPlainTextBody('Your leave has been ' + leave.Status__c + '.');
                emails.add(email);
            }
        }
        
        if (!emails.isEmpty()) {
            Messaging.sendEmail(emails);
        }
    }
}