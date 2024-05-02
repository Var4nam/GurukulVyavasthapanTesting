@isTest
private class TeacherImportControllerTest {
    
    @isTest
    static void testSaveFile() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Result__c testResult = DataFactory.createResultRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Subject__c testSubject = DataFactory.createSubjectWithClass(testClass.Id, true);
        
        Teacher__c testTeacher = DataFactory.createTeacherRecord(testSchool.Id, true);
        
        Assign_Classes__c testAssignClass = DataFactory.createAssignClassRecord(testClass.Id, testSubject.Id, testTeacher.Id, True);
        
        String base64Data = 'First Name,Last Name,Gender,Contact Information,Specialization,School Name,Enrollment Number,Joining Date,Result,Assigned Class,Father Name,Mother Name,Parent Contact Information,Address1,Address2,Landmark,Locality,Country,State,City,Blood Group,Postal Code,User Name,Password\n' +
            'John,Doe,Male,7410852963,Maths,Test School,202014067,2000-10-13,Pass,Test Class,Joe,Die,9638527410,barra,baraa8,sabjiMandi,Barra,India,Up,Kanpur,O+,208027,Varun,Varun@1234';
        
        Test.startTest();
        List<Teacher__c> savedTeachers = TeacherImportController.saveFile(base64Data);
        Test.stopTest();
        
        System.assertEquals(0, savedTeachers.size(), 'No teachers were inserted');
    }
}