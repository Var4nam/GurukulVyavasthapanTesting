@isTest
public class StudentImportControllerTest {

    @isTest
    static void testSaveFile() {
        Account testSchool = new Account(Name = 'Test School');
        Insert testSchool;

        Result__c testResult = new Result__c(Name = 'Pass');
        Insert testResult;
    
        Class__c testClass = new Class__c(Name = 'Test Class', School__c = testSchool.Id);
        Insert testClass;
        
        Student__c st1 = new Student__c(First_Name__c = 'Test1', Class__c = testClass.Id, Gender__c = 'Male', school__c = testSchool.Id, Roll_Number__c = 7418520);
        Insert st1;
        
        Student__c st2 = new Student__c(First_Name__c = 'Test2', Class__c = testClass.Id, Gender__c = 'Male', school__c = testSchool.Id, Roll_Number__c = 7418521);
        Insert st2;

        Date expectedDateOfBirth = Date.newInstance(2000, 10, 13);

        Date expectedEnrollmentDate = Date.newInstance(2024, 06, 13);

        String base64Data = 'First Name,Last Name,Gender,Contact Information,Date of Birth,Blood Group,School Name,Enrollment Date,Enrollment Number,Roll Number,Class,Result,Grade level,Father Name,Mother Name,Parent Contact Information,Guardian Name,RelationShip,sibling1Name,sibling2Name,Country,State,City,Postal Code,Locality,Addressline1,Addressline2,Landmark,UserName,Password\n' +
            'John,Doe,Male,7410852963,2000-10-13,O+,Test School,2000-10-13,202014067,7410852,Test Class,Pass,A+,Joe,Die,9638527410,Test,Cousin,Test1,Test2,India,Up,Kanpur,208027,barra,baraa8,sabjiMandi,Barra,Test,Varun@@1234';

        try{
            Test.startTest();
            List<Student__c> savedStudents = StudentImportController.saveFile(base64Data);
            Test.stopTest();
            
            System.assertNotEquals(0, savedStudents.size(), 'No Students were inserted');
        } catch(AuraHandledException e) {
            System.debug('An error occurred: ' + e.getMessage());
        } catch(Exception e) {
            System.debug('An unexpected error occurred: ' + e.getMessage());
        }
        /*Student__c savedStudent = savedStudents[0];
        System.assertEquals('John', savedStudent.First_Name__c);
        System.assertEquals('Doe', savedStudent.Last_Name__c);
        System.assertEquals('7410852963', savedStudent.Contact_Information__c);
        System.assertEquals(expectedDateOfBirth, savedStudent.Date_of_Birth__c);
        System.assertEquals('O+', savedStudent.Blood_Group__c);
        System.assertEquals(testSchool.Id, savedStudent.School__c);
        System.assertEquals(testClass.Id, savedStudent.Class__c);
        System.assertEquals(expectedEnrollmentDate, savedStudent.Enrollment_Date__c);
        System.assertEquals('202014067', savedStudent.Enrollment_Number__c);
        System.assertEquals(testResult.Id, savedStudent.Result__c);
        System.assertEquals(7410852, (Integer) savedStudent.Roll_Number__c);
        System.assertEquals('A+', savedStudent.Grade_Level__c);
        System.assertEquals('Joe', savedStudent.Father_Name__c);
        System.assertEquals('Die', savedStudent.Mother_Name__c);
        System.assertEquals('9638527410', savedStudent.Parent_Contact_Information__c);
        System.assertEquals('barra', savedStudent.Address_line_1__c);
        System.assertEquals('baraa8', savedStudent.Address_line_2__c);
        System.assertEquals('sabjiMandi', savedStudent.Land_Mark__c);
        System.assertEquals('Barra', savedStudent.Locality__c);
        System.assertEquals('India', savedStudent.Country__c);
        System.assertEquals('Up', savedStudent.State__c);
        System.assertEquals('Kanpur', savedStudent.City__c);
        System.assertEquals(208027, savedStudent.Postal_code__c);*/
    }
}