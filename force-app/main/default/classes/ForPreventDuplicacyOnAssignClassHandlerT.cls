@isTest
public class ForPreventDuplicacyOnAssignClassHandlerT {
    
    @testSetup static void preventDuplicacyOnSubject() {
        Account  accountObj =  DataFactory.createAccountRecord(true);
        Class__c  classObj =  DataFactory.createClassRecord(accountObj.Id, true);
        Subject__c  subjectObj =  DataFactory.createSubjectRecord(true);
        Teacher__c  teacherObj =  DataFactory.createTeacherRecord(accountObj.Id, true);
        Assign_Classes__c AssignClass = DataFactory.createAssignClassRecord(classObj.Id, subjectObj.Id, teacherObj.Id, true);
        Assign_Classes__c duplicateAssignClassRecords = DataFactory.createAssignClassDuplicateRecords(classObj.Id, subjectObj.Id, teacherObj.Id, true);
    } 
    
    @isTest
    static void PreventDuplicateRecordsOfSubject() {
        Account accObj = DataFactory.createAccountRecord(true);
        Class__c clsObj = DataFactory.createClassRecord(accObj.Id, true);
        Subject__c sbjObj = DataFactory.createSubjectRecord(true);
        Teacher__c teaObj = DataFactory.createTeacherRecord(accObj.Id, true);
        
        Assign_Classes__c assignClassObj = new Assign_Classes__c();
        assignClassObj.Class__c = clsObj.Id;
        assignClassObj.Subject__c = sbjObj.Id;
        assignClassObj.Teacher__c = teaObj.Id;
        insert assignClassObj;
    }
}