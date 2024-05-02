public without sharing class TeacherController {
    
    @AuraEnabled
    public static void createAnnouncementRecords(Announcement__c announce) {
        System.debug('create announce :: '+announce);
        if(announce != null){
            Insert announce;
        }        
    }
    
    @AuraEnabled
    public static void updateTotalAnnouncement(String teacherId, String recordId, String statusValue) {
        try {
            Announcement__c announceObj = [
                SELECT Id, Status__c 
                FROM Announcement__c 
                WHERE Id = :recordId 
                LIMIT 1
            ];
            
            if (announceObj != null) {
                announceObj.Status__c = statusValue;
                UPDATE announceObj;
            }
        } catch (Exception e) {
            throw new AuraHandledException('An error occurred while updating the record: ' + e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static AnnouncementWrapper getAnnouncementRecords(String teacherId, String status) {
        AnnouncementWrapper resultWrapper = new AnnouncementWrapper();
        
        List<Teacher__c> admins = [
            SELECT Id, Name, Role__c
            FROM Teacher__c 
            WHERE Id = :teacherId 
            AND Role__c = 'System administrator'
            LIMIT 1
        ];
        
        if (admins.isEmpty()) {
            resultWrapper.role = '';
            resultWrapper.announcementRecordList = fetchAnnouncementRecords(teacherId, status);
        } else {
            resultWrapper.role = admins[0].Role__c;
            resultWrapper.announcementRecordList = fetchAnnouncementRecords(null, status);
        }
        
        return resultWrapper;
    }
    
    private static List<Announcement__c> fetchAnnouncementRecords(String teacherId, String status) {
        if (teacherId != null) {
            return [
                SELECT Id, Announcement_Days__c, Name, Status__c, Description__c, End_Date_Time__c, Start_Date_Time__c, Type__c
                FROM Announcement__c
                WHERE Status__c = :status
            ];

        } else {
            return [
                SELECT Id, Announcement_Days__c, Name, Status__c, Description__c, End_Date_Time__c, Start_Date_Time__c, Type__c
                FROM Announcement__c
                WHERE Status__c = :status
            ];

        }
    }
    
    public class AnnouncementWrapper {
        @AuraEnabled
        public String role { get; set; }
        @AuraEnabled
        public List<Announcement__c> announcementRecordList { get; set; }
    }
}