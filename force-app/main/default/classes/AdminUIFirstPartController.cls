/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-29-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class AdminUIFirstPartController {
    
    @AuraEnabled(cacheable=true)
    public static List<Teacher__c> getTeacherRecordsForAttendance() {
        try {
            List<Teacher__c> teacherList = [SELECT Id, Name, Contact_Information__c FROM Teacher__c WITH SECURITY_ENFORCED];
            if (teacherList.isEmpty()) {
                return null;
            }
            return teacherList;
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static Decimal getPaperOutof(String paperType) {
        try {
            Paper__c paper = [SELECT Id, Out_of__c FROM Paper__c WHERE Paper_Type__c =: paperType WITH SECURITY_ENFORCED LIMIT 1];
            if(paper != null) {
                return paper.Out_of__c;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Paper__c> getPaperRecords(String field, String sortOrder, List<String> fields) {
        String query;
        if(fields.isEmpty()) {
            query  = 'SELECT Id, Name, Paper_Type__c, Out_of__c, Assign_Class__r.Name, Maximum_Marks__c, Subject__r.Name FROM Paper__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Paper__c';
        }
        if(field != null && sortOrder != null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));
    }

    @AuraEnabled(cacheable=true)
    public static String getAdminName(String adminId) {
        try {
            Admin__c admin = [SELECT Id, Name FROM Admin__c WHERE Id =: adminId WITH SECURITY_ENFORCED LIMIT 1];
            if(admin != null) {
                return admin.Name;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Publish__c> getPublishRecords() {
        try {
            List<Publish__c> publishList = [SELECT Id, Class__c, First_Test__c, Second_Test__c, Third_Test__c, Half_Yearly__c, Final__c FROM Publish__c WITH SECURITY_ENFORCED];
            if(!publishList.isEmpty()) {
                return publishList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Teacher__c> getTeacherRecords(String field, String sortOrder, List<String> fields) {
        String query;
        if(fields.isEmpty()) {
            query  = 'SELECT Id, School__c, School__r.Name, First_Name__c, Last_Name__c, Name, Contact_Information__c, Enrollment_Number__c, Specialization__c FROM Teacher__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Teacher__c';
        }
        if(field != null && sortOrder != null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Announcement__c> getAnnouncementRecords(String field, String sortOrder, List<String> fields){
        String query;
        if(fields.isEmpty()){
            query = 'SELECT Id, Name, Type__c, Start_Date_Time__c, End_Date_Time__c, Description__c, Status__c FROM Announcement__c';
        }else{
            query  = 'SELECT ' + fields +' FROM Announcement__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Parent_Guardian__c> getParentRecords(String field, String sortOrder, List<String> fields){
        String query;
        if(fields.isEmpty()) {
            query  = 'SELECT Id, Name, Relationship_to_Student__c, Student__r.Name, Contact_Information__c FROM Parent_Guardian__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Parent_Guardian__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Student__c> getStudentRecords(String field, String sortOrder, List<String> fields){
        String query;
        if(fields.isEmpty()) {
            query  = 'SELECT Id, First_Name__c, Last_Name__c, Contact_Information__c, Name, Class__r.Name, Date_of_Birth__c, Roll_Number__c, Enrollment_Date__c, Father_Name__c, Mother_Name__c, Parent_Contact_Information__c, Guardian_Name__c, Relationships__c, Result__r.Name, Postal_code__c, Blood_Group__c, Address_line_1__c, Address_line_2__c FROM Student__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Student__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));   
        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Student__c> getStudentRecordsForAttendance(String classValue){
        try {
            List<Student__c> studentList = [SELECT Id, Name, Class__c, Contact_Information__c FROM Student__c WHERE Class__c =: classValue OR Class__r.Name =: classValue WITH SECURITY_ENFORCED ORDER BY Name ASC];
            System.debug('studentList :::: '+studentList);
            if(!studentList.isEmpty()) {
                return studentList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Exam__c> getExamRecords(String classId){
        try {
            List<Exam__c> examsList  = [SELECT Id, Name, Store_Student_Marks_Data__c, Student__r.Class__c, Student__r.Name, Total_Obtain_Marks__c, Total_Outof_Marks__c FROM Exam__c WHERE Student__r.Class__c = :classId WITH SECURITY_ENFORCED ORDER BY Student__r.Name ASC];   
            if(!examsList.isEmpty()) {
                return examsList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Admin__c> getAdminRecords(String field, String sortOrder, List<String> fields){
        String query;
        if(fields.isEmpty()) {
            query  = 'SELECT Id, Name, First_Name__c, Last_Name__c, User_Name__c, Password__c, Profile__c, Gender__c FROM Admin__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Admin__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));   
        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Subject__c> getSubjectRecords(String field, String sortOrder, List<String> fields){
        String query;
        if(fields.isEmpty()) {
            query  = 'SELECT Id, Name, Class__r.Name, Subject_Code__c FROM Subject__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Subject__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));   
        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Event_Management__c> getEventManagementRecords(String field, String sortOrder, List<String> fields){
        String query;
        if(fields == null || fields.isEmpty()) {
            query = 'SELECT Id, Name, Date__c, Description__c, Address__c, School__r.Name FROM Event_Management__c';
        } else {
            query = 'SELECT ' + String.join(fields, ',') + ' FROM Event_Management__c';
        }
        if(field != null && sortOrder != null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        System.debug('Query: ' + query);
        return Database.query(query);
    }

    
    @AuraEnabled(cacheable=true)
    public static List<Holiday__c> getHolidays() {
        try {
            List<Holiday__c> holidayList = [SELECT Id, Name, Year__c, Type__c, Date__c FROM Holiday__c WITH SECURITY_ENFORCED];
            if(!holidayList.isEmpty()) {
                return holidayList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Staff__c> showEmployeeRecord(String field, String sortOrder, List<String> fields){
        String query;
        if(fields.isEmpty()) {
            query  = 'SELECT Id, Name, Staff_Type__c FROM Staff__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Staff__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Assign_Classes__c> getAssignClassRecord(String teacherId) {
        try {
            List<Assign_Classes__c> assignList = [SELECT Id, Subject__c, Subject__r.Name, Class__r.Name, Teacher__r.Name, Class__r.Section__c FROM Assign_Classes__c WHERE Teacher__c =: teacherId WITH SECURITY_ENFORCED];
            if(!assignList.isEmpty()) {
                return assignList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }

    
    @AuraEnabled(cacheable=true)
    public static List<Assign_Classes__c> showAssignClassRecord(String field, String sortOrder, List<String> fields){
        String query;
        if(fields == null || fields.isEmpty()) {
            query  = 'SELECT Id, Class__r.Name, Class__c, Subject__c, Teacher__c, Subject__r.Name, Teacher__r.Name FROM Assign_Classes__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Assign_Classes__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Class__c> showClassRecord(String field, String sortOrder, List<String> fields){
        String query;
        if(fields == null || fields.isEmpty()) {
            query  = 'SELECT Id, Name, Room_Number__c, Section__c, School__r.Name FROM Class__c';
        } else {
            query  = 'SELECT ' + fields +' FROM Class__c';
        }
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query.replaceAll('\\(', '').replaceAll('\\)',''));
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Fee_Management__c> showFeeManageRecord(String classId){
        try {
            List<Fee_Management__c> feeManagementList = [SELECT Id, Due_Date__c, Duration__c, Fee_Type__c, Paid_Amount__c, Payment_Status__c, Student__r.Name, Student__r.Roll_Number__c FROM Fee_Management__c WHERE Student__r.Class__c =: classId WITH SECURITY_ENFORCED];
            if(!feeManagementList.isEmpty()) {
                return feeManagementList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Attendance__c> getAttendanceRecord(String classId, String fieldName, String monthName, String teacherId, String staffId, String recordType){
        String query = '';
        if(recordType == 'Student__c') {
            query  = 'SELECT Id, Name, Remarks__c, Student__r.Name, Student__c, Class__c, Date__c, ' + fieldName +' FROM Attendance__c WHERE Name = \''+monthName+'\' AND Class__c = \''+classId+'\' ORDER BY Student__r.Name ASC';
        } else if(recordType == 'Teacher__c') {
            query  = 'SELECT Id, Name, Remarks__c, Teacher__r.Name, Teacher__c, Date__c, ' + fieldName +', RecordTypeId FROM Attendance__c WHERE Name = \''+monthName+'\' AND Teacher__c = \''+teacherId+'\' ORDER BY Teacher__r.Name ASC';
        } else {
            query  = 'SELECT Id, Name, Remarks__c, Staff__r.Name, Staff__c, Date__c, ' + fieldName +', RecordTypeId FROM Attendance__c WHERE Name = \''+monthName+'\' AND Staff__c = \''+staffId+'\' ORDER BY Staff__r.Name ASC';
        }
        system.debug('query  '+ query);
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<TimeTable__c> getTimeTableReletedClassAndSection(String classId) {
        try {
            List <TimeTable__c> timeTableList =  [
                SELECT Id, Name, Period__c, Class__c, Start_Time__c, End_Time__c, Day__c, Assign_Class__c, Assign_Class__r.Teacher__r.Name, Assign_Class__r.Subject__r.Name
                FROM TimeTable__c 
                WHERE Class__c =:classId WITH SECURITY_ENFORCED ORDER by Day__c ASC
            ];
            if(!timeTableList.isEmpty()) {
                return timeTableList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Teacher__c> getTeacherRecord(String teacherId) {
        try {
            List <Teacher__c> teacherList =  [SELECT Id, Specialization__c FROM Teacher__c WHERE Id =: teacherId WITH SECURITY_ENFORCED];
            if(!teacherList.isEmpty()) {
                return teacherList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Subject__c> getSubjectRecord(String subjectId) {
        try {
            List <Subject__c> subjectList =  [SELECT Id, Name FROM Subject__c WHERE Id =: subjectId WITH SECURITY_ENFORCED];
            if(!subjectList.isEmpty()) {
                return subjectList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getSchoolRecord() {
        try {
            List <Account> accountList =  [SELECT Id, Class__r.Name, No_Of_Period__c, Duration__c FROM Account WITH SECURITY_ENFORCED];
            if(!accountList.isEmpty()) {
                return accountList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled
    public static List<TimeTable__c> createTimeTableRecord(String classId) {
        List<String> weekdays = new List<String>{'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'};
            List<TimeTable__c> existingRecords = [
                SELECT Id, Name, Period__c, Class__c, Start_Time__c, End_Time__c, Period_Time__c, Day__c, Assign_Class__c, Teacher__r.Name, Teacher__r.Specialization__c, Subject__r.Name 
                FROM TimeTable__c 
                WHERE Class__c = :classId ORDER by Day__c ASC
            ];
        Account accountRecord = [SELECT Id, No_Of_Period__c, Start_Time__c, Duration__c  FROM Account LIMIT 1];
        if (existingRecords.isEmpty()) {
            List<TimeTable__c> timeTableRecords = new List<TimeTable__c>();
            for (String weekday : weekdays) {
                for (Integer i = 0; i < accountRecord.No_Of_Period__c; i++) {
                    TimeTable__c timeObj = new TimeTable__c();
                    timeObj.Subject__c = null;
                    timeObj.Teacher__c = null;
                    timeObj.Class__c = classId; // Ensure classId is a valid Id
                    timeObj.Period__c = i+1;
                    timeObj.Day__c = weekday;
                    Integer hours = accountRecord.Start_Time__c.hour();
                    Integer minutes = accountRecord.Start_Time__c.minute();
                    Integer totalMinutes = hours * 60 + minutes;
                    Time startTime = Time.newInstance(hours, minutes, 0, 0);
                    Time calculatedTime =  startTime.addMinutes((Integer)(accountRecord.Duration__c * i));
                    timeObj.Period_Time__c = calculatedTime;
                    timeTableRecords.add(timeObj);
                }
            }
            
            if (!timeTableRecords.isEmpty()) {
                insert timeTableRecords;
                return [SELECT Id, Name, Period__c, Class__c, Period_Time__c, Start_Time__c, End_Time__c, Day__c, Assign_Class__c, Teacher__r.Name, Subject__r.Name 
                        FROM TimeTable__c 
                        WHERE Class__c = :classId ORDER by Day__c ASC];
            }
        } else {
            return existingRecords;
        }
        return new List<TimeTable__c>(); // Return an empty list if no records were inserted or retrieved
    }

    /*@AuraEnabled
    public static List<TimeTable__c> createTimeTableRecord(String classId) {
        List<String> weekdays = new List<String>{'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'};
            List<TimeTable__c> existingRecords = [
                SELECT Id, Name, Period__c, Class__c, Start_Time__c, End_Time__c, Period_Time__c, Day__c, Teacher__r.Name ,Subject__r.Name 
                FROM TimeTable__c 
                WHERE Class__c = :classId ORDER by Day__c ASC
            ];
        System.debug('existingRecords :::::: '+existingRecords);
        Account accountREcord = [SELECT Id , No_Of_Period__c, Start_Time__c, Duration__c  FROM Account LIMIT 1];
        
        if (existingRecords.size() < = 0) {
            List<TimeTable__c> timeTableRecords = new List<TimeTable__c>();
            for (String weekday : weekdays) {
                for (Integer i = 0; i <accountREcord.No_Of_Period__c; i++) {
                    TimeTable__c timeObj = new TimeTable__c();
                    timeObj.Subject__c = null;
                    timeObj.Teacher__c = null;
                    timeObj.Class__c = classId;
                    timeObj.Period__c = i+1;
                    timeObj.Day__c = weekday;
                    Integer hours = accountRecord.Start_Time__c.hour();
                    Integer minutes = accountRecord.Start_Time__c.minute();
                    Integer totalMinutes = hours * 60 + minutes;
                    Time startTime = Time.newInstance(hours, minutes, 0, 0);
                    Time calculatedTime =  startTime.addMinutes((Integer)(accountRecord.Duration__c * i));
                    timeObj.Period_Time__c = calculatedTime;
                    timeTableRecords.add(timeObj);
                }
            }
            
            if (!timeTableRecords.isEmpty()) {
                insert timeTableRecords;
                List<TimeTable__c> insertedList = [
                    SELECT Id, Name, Period__c, Class__c, Period_Time__c, Start_Time__c, End_Time__c, Day__c, Teacher__r.Name ,Subject__r.Name 
                    FROM TimeTable__c 
                    WHERE Class__c = :classId ORDER by Day__c ASC
                ];
                return insertedList;
            }else{
                return NULL;
            }
        }else{
            return existingRecords;
        }
    }*/



    
    @AuraEnabled(cacheable=true)
    public static List<Announcement__c> showAnnoucementDashboard(){
        try {
            List<Announcement__c> announcementList =  [SELECT Id, Name, Start_Date_Time__c, End_Date_Time__c FROM Announcement__c WITH SECURITY_ENFORCED];
            if(!announcementList.isEmpty()) {
                return announcementList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<ObjectNameAndLabelWrapper> getFieldAPINames(String objName) {
        List<ObjectNameAndLabelWrapper> wrapperList = new List<ObjectNameAndLabelWrapper>();
        Map<String, Schema.SObjectField> fieldsMap = Schema.getGlobalDescribe().get(objName).getDescribe().fields.getMap();
        
        for (String fieldName : fieldsMap.keySet()) {
            Schema.DescribeFieldResult fieldResult = fieldsMap.get(fieldName).getDescribe();
            if(fieldResult.getName() != 'Id' && fieldResult.getName() != 'CreatedById' && fieldResult.getName() != 'OwnerId' && fieldResult.getName() != 'LastModifiedById' && fieldResult.getName() != 'SystemModStamp') {
                ObjectNameAndLabelWrapper wrapperObj = new ObjectNameAndLabelWrapper();
                wrapperObj.fieldLabel = fieldResult.getLabel();
                wrapperObj.fieldApiName = fieldResult.getName();
                wrapperList.add(wrapperObj);
            }
        }
        
        return wrapperList;
    }
    
    public class ObjectNameAndLabelWrapper implements Comparable {
        @AuraEnabled 
        public String objectApiName {get;set;}
        @AuraEnabled 
        public String objectLabel {get;set;}
        @AuraEnabled public String fieldLabel {get;set;}
        @AuraEnabled public String fieldApiName {get;set;}
        
        public Integer compareTo(Object compareTo) {
            ObjectNameAndLabelWrapper other = (ObjectNameAndLabelWrapper) compareTo;
            if (this.objectApiName > other.objectApiName) {
                return 1;
            } else if (this.objectApiName == other.objectApiName) {
                return 0;
            }
            return -1;
        }
    }
    
    @AuraEnabled (cacheable=true)
    public static List<Contact> fetchContact(){
        try {
            List<Contact> contactList =  [SELECT Id, Name, Account.Name, AccountId, Email FROM Contact WITH SECURITY_ENFORCED LIMIT 10];
            if(!contactList.isEmpty()) {
                return contactList;
            } else {
                return null;
            }
        } catch (QueryException e) {
            return null;
        } 
    }
}