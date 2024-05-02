public class AuthenticationTriggerHandler {
  public static void recordVerification(List<Authentication__c> authRecord) {
    List<Id> authUserId = new List<Id>();
    List<Id> alreadyPresentIdList = new List<Id>();
    Map<Id, Authentication__c> authByIdMap = new Map<Id, Authentication__c>();

    if (authRecord.size() > 0) {
      for (Authentication__c auth : authRecord) {
        authByIdMap.put(auth.Id, auth);
        if (auth?.Staff__c != null) {
          authUserId.add(auth.Staff__c);
        }
        if (auth?.Student__c != null) {
          authUserId.add(auth.Student__c);
        }
        if (auth?.Teacher__c != null) {
          authUserId.add(auth.Teacher__c);
        }
      }
      List<Authentication__c> alreadyPresentStaff = [
        SELECT Staff__c
        FROM Authentication__c
        WHERE Staff__c IN :authUserId
      ];
      List<Authentication__c> alreadyPresentStudent = [
        SELECT Student__c
        FROM Authentication__c
        WHERE Student__c IN :authUserId
      ];
      List<Authentication__c> alreadyPresentTeacher = [
        SELECT Teacher__c
        FROM Authentication__c
        WHERE Teacher__c IN :authUserId
      ];

      if (alreadyPresentStaff.size() > 0) {
        for (Authentication__c authId : alreadyPresentStaff) {
          alreadyPresentIdList.add(authId.Staff__c);
        }
      }
      if (alreadyPresentStudent.size() > 0) {
        for (Authentication__c authId : alreadyPresentStudent) {
          alreadyPresentIdList.add(authId.Student__c);
        }
      }
      if (alreadyPresentTeacher.size() > 0) {
        for (Authentication__c authId : alreadyPresentTeacher) {
          alreadyPresentIdList.add(authId.Teacher__c);
        }
      }
      for (Authentication__c auth : authRecord) {
        if (alreadyPresentIdList.contains(auth.Staff__c)) {
          auth.addError('Records already present');
        }
        if (alreadyPresentIdList.contains(auth.Student__c)) {
          auth.addError('Records already present');
        }
        if (alreadyPresentIdList.contains(auth.Teacher__c)) {
          auth.addError('Records already present');
        }
      }
    }
  }

  public static void theSender(List<Authentication__c> sendAuth) {
    List<Id> userId = new List<Id>();
    List<SObject> sobjList = new List<SObject>();
    if (sendAuth.size() > 0) {
      for (Authentication__c auth : sendAuth) {
        if (auth.Staff__c != null) {
          userId.add(auth.Staff__c);
        }
        if (auth.Student__c != null) {
          userId.add(auth.Student__c);
        }
        if (auth.Teacher__c != null) {
          userId.add(auth.Teacher__c);
        }
      }
      sobjList.addAll([SELECT Id, Student__r.Name, Student__r.School__c, Student__r.Enrollment_Number__c, Passphrase__c, Teacher__r.Name, Teacher__r.School__c,Teacher__r.Enrollment_Number__c, Teacher__r.Email__c, Staff__r.Name,Staff__r.Staff_Type__c,  Name FROM Authentication__c WHERE Id IN: userId]);

    }
  }
}