@isTest
public class AdminUIFirstPartControllerTest {
    /*
    @isTest
    static void testGetUserName() {
        String expectedUserName = UserInfo.getName();
        
        Test.startTest();
        String actualUserName = adminUIFirstPartController.getUserName();
        Test.stopTest();
        
        System.assertEquals(expectedUserName, actualUserName, 'User name should match expected');
    }
    
    @isTest
    static void testGetTeacherRecords_NoFields() {
        Test.startTest();
        List<Teacher__c> teachers = adminUIFirstPartController.getTeacherRecords(null, null, new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, teachers, 'List of teachers should not be null');
    }
    
    @isTest
    static void testGetTeacherRecords_WithFields() {
        List<String> fields = new List<String>{'Id', 'Name', 'School__c'};
            Test.startTest();
        List<Teacher__c> teachers = adminUIFirstPartController.getTeacherRecords(null, null, fields);
        Test.stopTest();
        System.assertNotEquals(null, teachers, 'List of teachers should not be null');
    }
    
    @isTest
    static void testGetTeacherRecords_WithSortOrder() {
        Test.startTest();
        List<Teacher__c> teachers = adminUIFirstPartController.getTeacherRecords('Name', 'ASC', new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, teachers, 'List of teachers should not be null');
    }
    
    @isTest
    static void testGetAnnouncementRecords_NoFields() {
        Test.startTest();
        List<Announcement__c> announcements = adminUIFirstPartController.getAnnouncementRecords(null, null, new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, announcements, 'List of announcements should not be null');
    }
    
    @isTest
    static void testGetAnnouncementRecords_WithFields() {
        List<String> fields = new List<String>{'Id', 'Name', 'Type__c'};
            Test.startTest();
        List<Announcement__c> announcements = adminUIFirstPartController.getAnnouncementRecords(null, null, fields);
        Test.stopTest();
        System.assertNotEquals(null, announcements, 'List of announcements should not be null');
    }
    
    @isTest
    static void testGetAnnouncementRecords_WithSortOrder() {
        Test.startTest();
        List<Announcement__c> announcements = adminUIFirstPartController.getAnnouncementRecords('Name', 'ASC', new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, announcements, 'List of announcements should not be null');
    }
    
    @isTest
    static void testGetParentRecords_NoFields() {
        Test.startTest();
        List<Parent_Guardian__c> parentGuardians = adminUIFirstPartController.getParentRecords(null, null, new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, parentGuardians, 'List of parent guardians should not be null');
    }
    
    @isTest
    static void testGetParentRecords_WithFields() {
        List<String> fields = new List<String>{'Id', 'Name', 'Relationship_to_Student__c'};
            Test.startTest();
        List<Parent_Guardian__c> parentGuardians = adminUIFirstPartController.getParentRecords(null, null, fields);
        Test.stopTest();
        System.assertNotEquals(null, parentGuardians, 'List of parent guardians should not be null');
    }
    
    @isTest
    static void testGetParentRecords_WithSortOrder() {
        Test.startTest();
        List<Parent_Guardian__c> parentGuardians = adminUIFirstPartController.getParentRecords('Name', 'ASC', new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, parentGuardians, 'List of parent guardians should not be null');
    }
    
    @isTest
    static void testGetStudentRecords_NoFields() {
        Test.startTest();
        List<Student__c> students = adminUIFirstPartController.getStudentRecords(null, null, new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, students, 'List of students should not be null');
    }
    
    @isTest
    static void testGetStudentRecords_WithFields() {
        List<String> fields = new List<String>{'Id', 'Name', 'Class__r.Name'};
            Test.startTest();
        List<Student__c> students = adminUIFirstPartController.getStudentRecords(null, null, fields);
        Test.stopTest();
        System.assertNotEquals(null, students, 'List of students should not be null');
    }
    
    @isTest
    static void testGetStudentRecords_WithSortOrder() {
        Test.startTest();
        List<Student__c> students = adminUIFirstPartController.getStudentRecords('First_Name__c', 'ASC', new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, students, 'List of students should not be null');
    }
    
    @isTest
    static void testGetAdminRecords_NoFields() {
        Test.startTest();
        List<Admin__c> admins = adminUIFirstPartController.getAdminRecords(null, null, new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, admins, 'List of admins should not be null');
    }
    
    @isTest
    static void testGetAdminRecords_WithFields() {
        List<String> fields = new List<String>{'Id', 'Name', 'User_Name__c'};
            Test.startTest();
        List<Admin__c> admins = adminUIFirstPartController.getAdminRecords(null, null, fields);
        Test.stopTest();
        System.assertNotEquals(null, admins, 'List of admins should not be null');
    }
    
    @isTest
    static void testGetAdminRecords_WithSortOrder() {
        Test.startTest();
        List<Admin__c> admins = adminUIFirstPartController.getAdminRecords('First_Name__c', 'ASC', new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, admins, 'List of admins should not be null');
    }
    
    @isTest
    static void testGetSubjectRecords_NoFields() {
        Test.startTest();
        List<Subject__c> subjects = adminUIFirstPartController.getSubjectRecords(null, null, new List<String>());
        Test.stopTest();
    }
    
    @isTest
    static void testGetSubjectRecords_WithFields() {
        List<String> fields = new List<String>{'Id', 'Name', 'Class__r.Name'};
            Test.startTest();
        List<Subject__c> subjects = adminUIFirstPartController.getSubjectRecords(null, null, fields);
        Test.stopTest();
        System.assertNotEquals(null, subjects, 'List of subjects should not be null');
    }
    
    @isTest
    static void testGetSubjectRecords_WithSortOrder() {
        Test.startTest();
        List<Subject__c> subjects = adminUIFirstPartController.getSubjectRecords('Name', 'ASC', new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, subjects, 'List of subjects should not be null');
    }
    
    
    @isTest
    static void testGetEventManagementRecords_NoFields() {
        Test.startTest();
        List<Event_Management__c> events = adminUIFirstPartController.getEventManagementRecords(null, null, new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, events, 'List of events should not be null');
    } 
    
    
    @isTest
    static void testGetEventManagementRecords_WithFields() {
        try {
            List<String> fields = new List<String>{'Id', 'Name', 'Date__c', 'Description__c', 'Address__c', 'School__r.Name'};
                Test.startTest();
            List<Event_Management__c> events = adminUIFirstPartController.getEventManagementRecords(null, null, fields);
            Test.stopTest();
            System.assertNotEquals(null, events, 'List of events should not be null');
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
            System.debug(LoggingLevel.ERROR, e);
            throw e;
        }
    }
    
    
    @isTest
    static void testGetEventManagementRecords_WithSortOrder() {
        Test.startTest();
        List<Event_Management__c> events = adminUIFirstPartController.getEventManagementRecords('Name', 'ASC', new List<String>());
        Test.stopTest();
        System.assertNotEquals(null, events, 'List of events should not be null');
    }
    
    
    @isTest
    static void testGetHolidays() {
        try {
            Test.startTest();
            List<Holiday__c> holidays = adminUIFirstPartController.getHolidays();
            Test.stopTest();
            System.assertNotEquals(null, holidays, 'List of holidays should not be null');
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
            System.debug(LoggingLevel.ERROR, e);
            throw e;
        }
    }
    
    
    @isTest
    static void testShowEmployeeRecord() {
        
        List<Staff__c> staffsWithoutFields  = adminUIFirstPartController.showEmployeeRecord(null, null, new List<String>());
        
        System.assertNotEquals(null, staffsWithoutFields , 'List of staffs should not be null when no fields are specified');
        
        List<String> specifiedFields = new List<String>{'Id', 'Name', 'Staff_Type__c'};
            Test.startTest();
        List<Staff__c> staffsWithFields = adminUIFirstPartController.showEmployeeRecord(null, null, specifiedFields);
        Test.stopTest();
        System.assertNotEquals(null, staffsWithFields, 'List of staffs should not be null when fields are specified');
    }
    
    @isTest
    static void testGetAssignClassRecord() {
        
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Teacher__c testTeacher = DataFactory.createTeacherRecord(testSchool.Id, True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Subject__c testSubject = DataFactory.createSubjectRecord(True);
        
        Assign_Classes__c testAssignClass = DataFactory.createAssignClassRecord(testClass.Id, testSubject.Id, testTeacher.Id, True);
        
        Test.startTest();
        List<Assign_Classes__c> assignClasses = adminUIFirstPartController.getAssignClassRecord(testTeacher.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, assignClasses, 'List of Assign_Classes__c should not be null');
        
        System.assertEquals(1, assignClasses.size(), 'List should contain one Assign_Classes__c record');
        Assign_Classes__c retrievedAssignClass = assignClasses[0];
        System.assertEquals(testTeacher.Id, retrievedAssignClass.Teacher__c, 'Retrieved Assign_Classes__c should belong to the test teacher');
        System.assertEquals(testClass.Id, retrievedAssignClass.Class__c, 'Retrieved Assign_Classes__c should be assigned to the test class');
        System.assertEquals(testSubject.Id, retrievedAssignClass.Subject__c, 'Retrieved Assign_Classes__c should be associated with the test subject');
    }
    
    @isTest
    static void testShowAssignClassRecord() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Subject__c testSubject = DataFactory.createSubjectRecord(True);
        
        Teacher__c testTeacher = DataFactory.createTeacherRecord(testSchool.Id, True);
        
        Assign_Classes__c testAssignClass = DataFactory.createAssignClassRecord(testClass.Id, testSubject.Id, testTeacher.Id, True);
        
        Test.startTest();
        List<Assign_Classes__c> result = adminUIFirstPartController.showAssignClassRecord(null, null, null);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of Assign_Classes__c should not be null');
        System.assertEquals(1, result.size(), 'List should contain one Assign_Classes__c record');
        Assign_Classes__c retrievedAssignClass = result[0];
    }
    
    
    @isTest
    static void testShowClassRecord() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Test.startTest();
        List<Class__c> result = adminUIFirstPartController.showClassRecord(null, null, null);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of Class__c should not be null');
        System.assertEquals(1, result.size(), 'List should contain one Class__c record');
        Class__c retrievedClass = result[0];
        System.assertEquals(testClass.Room_Number__c, retrievedClass.Room_Number__c, 'Retrieved Class__c should have the same room number as the test record');
        System.assertEquals(testClass.Section__c, retrievedClass.Section__c, 'Retrieved Class__c should have the same section as the test record');
    }
    
    @isTest
    static void testShowFeeManageRecord() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Student__c testStudent = DataFactory.createStudentRecord('Test', testClass.Id, testSchool.Id, True);
        
        Fee_Management__c testFee = DataFactory.createFeeManagementRecord(testStudent.Id, True);
        
        Test.startTest();
        List<Fee_Management__c> result = adminUIFirstPartController.showFeeManageRecord(null, null, null);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of Fee_Management__c should not be null');
        System.assertEquals(1, result.size(), 'List should contain one Fee_Management__c record');
        Fee_Management__c retrievedFee = result[0];
        System.assertEquals(testFee.Name, retrievedFee.Name, 'Retrieved Fee_Management__c should have the same name as the test record');
        System.assertEquals(testFee.Amount__c, retrievedFee.Amount__c, 'Retrieved Fee_Management__c should have the same amount as the test record');
    }
    
    
    @isTest
    static void testGetAttendanceRecord_StudentType() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Student__c testStudent = DataFactory.createStudentRecord('Test', testClass.Id, testSchool.Id, True);
        
        String fieldName = 'OwnerId';
        String monthName = 'MonthName';
        List<Attendance__c> testAttendanceList = new List<Attendance__c>{
            new Attendance__c(Name = monthName, Student__c = testStudent.Id, Class__c = testClass.Id),
                new Attendance__c(Name = monthName, Student__c = testStudent.Id, Class__c = testClass.Id)
                };
                    insert testAttendanceList;
        
        Test.startTest();
        List<Attendance__c> result = adminUIFirstPartController.getAttendanceRecord(testClass.Id, fieldName, monthName, null, 'Student__c');
        Test.stopTest();
    }
    
    @isTest
    static void testGetAttendanceRecord_TeacherType() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Teacher__c testTeacher = DataFactory.createTeacherRecord(testSchool.Id, True);
        
        String fieldName = 'OwnerId';
        String monthName = 'MonthName';
        List<Attendance__c> testAttendanceList = new List<Attendance__c>{
            new Attendance__c(Name = monthName, Teacher__c = testTeacher.Id),
                new Attendance__c(Name = monthName, Teacher__c = testTeacher.Id)
                };
                    insert testAttendanceList;
        
        Test.startTest();
        List<Attendance__c> result = adminUIFirstPartController.getAttendanceRecord(null, fieldName, monthName, testTeacher.Id, 'Teacher__c');
        Test.stopTest();
    }
    
    @isTest
    static void testGetTimeTableRelatedClassAndSection() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True); 
        
        TimeTable__c testTimeTable1 = new TimeTable__c(
            Name = 'Test TimeTable 1',
            Period__c = 1,
            Class__c = testClass.Id,
            Day__c = 'Monday'
        );
        TimeTable__c testTimeTable2 = new TimeTable__c(
            Name = 'Test TimeTable 2',
            Period__c = 2,
            Class__c = testClass.Id,
            Day__c = 'Tuesday'
        );
        insert new List<TimeTable__c>{testTimeTable1, testTimeTable2};
            
            Test.startTest();
        List<TimeTable__c> result = adminUIFirstPartController.getTimeTableReletedClassAndSection(testClass.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of TimeTable__c should not be null');
        System.assertEquals(2, result.size(), 'List should contain two TimeTable__c records');
        for (TimeTable__c timeTable : result) {
            System.assertEquals(testClass.Id, timeTable.Class__c, 'Class__c field should match');
        }
    }
    
    @isTest
    static void testGetTeacherRecord() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Teacher__c testTeacher = DataFactory.createTeacherRecord(testSchool.Id, True);
        
        String teacherId = testTeacher.Id;
        
        Test.startTest();
        List<Teacher__c> result = adminUIFirstPartController.getTeacherRecord(teacherId);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of Teacher__c should not be null');
        System.assertEquals(1, result.size(), 'List should contain one Teacher__c record');
        Teacher__c returnedTeacher = result[0];
        System.assertEquals(testTeacher.Specialization__c, returnedTeacher.Specialization__c, 'Specialization__c should match');
        System.assertEquals(teacherId, returnedTeacher.Id, 'Id should match');
    }
    
    @isTest
    static void testGetSubjectRecord() {
        Subject__c testSubject = DataFactory.createSubjectRecord(True);
        
        String subjectId = testSubject.Id;
        
        Test.startTest();
        List<Subject__c> result = adminUIFirstPartController.getSubjectRecord(subjectId);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of Subject__c should not be null');
        System.assertEquals(1, result.size(), 'List should contain one Subject__c record');
        Subject__c returnedSubject = result[0];
        System.assertEquals(subjectId, returnedSubject.Id, 'Id should match');
    }
    
    @isTest
    static void testGetSchoolRecord() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        Test.startTest();
        List<Account> result = AdminUIFirstPartController.getSchoolRecord();
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of Account should not be null');
        System.assertEquals(1, result.size(), 'List should contain one Account record');
        Account returnedAccount = result[0];
        System.assertEquals(testSchool.Id, returnedAccount.Id, 'Id should match');
        System.assertEquals(null, returnedAccount.Class__r, 'Related Class__c records should not be null');
        Class__c returnedClass = returnedAccount.Class__r;
    }
    
    @isTest
    static void testCreateTimeTableRecord() {
        
        Account testAccount =  DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testAccount.Id, True);
        
        String classId = testClass.Id;
        
        Test.startTest();
        List<TimeTable__c> timeTableRecords = adminUIFirstPartController.createTimeTableRecord(classId);
        Test.stopTest();
        
        System.assertNotEquals(null, timeTableRecords, 'List of timeTableRecords should not be null');
        
        for (TimeTable__c record : timeTableRecords) {
            System.assertEquals(classId, record.Class__c, 'Class__c field should match the provided classId');
            System.assertNotEquals(null, record.Day__c, 'Day__c field should not be null');
            System.assertNotEquals(null, record.Period__c, 'Period__c field should not be null');
        }
    }
    
    
    @isTest
    static void testShowAnnouncementDashboard() {
        List<Announcement__c> announcements = new List<Announcement__c>{
            new Announcement__c(Name = 'Announcement 1', Start_Date_Time__c = Date.today(), End_Date_Time__c = Date.today().addDays(7), type__c = 'Game'),
                new Announcement__c(Name = 'Announcement 2', Start_Date_Time__c = Date.today().addDays(1), End_Date_Time__c = Date.today().addDays(8), type__c = 'Exam')
                };
                    insert announcements;
        
        Test.startTest();
        List<Announcement__c> result = AdminUIFirstPartController.showAnnoucementDashboard();
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'List of Announcement__c should not be null');
        System.assertEquals(2, result.size(), 'List should contain all announcements');
    }
    
    
    @isTest
    static void testGetFieldAPINames() {
        String objectName = 'Account';
        Map<String, Schema.SObjectField> fieldsMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        
        Test.startTest();
        List<AdminUIFirstPartController.ObjectNameAndLabelWrapper> result = AdminUIFirstPartController.getFieldAPINames(objectName);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'Result should not be null');
        for (AdminUIFirstPartController.ObjectNameAndLabelWrapper wrapper : result) {
            System.assertNotEquals(null, wrapper.fieldLabel, 'Field label should not be null');
            System.assertNotEquals(null, wrapper.fieldApiName, 'Field API name should not be null');
            System.assertNotEquals('Id', wrapper.fieldApiName, 'Field API name should not be "Id"');
            System.assertNotEquals('CreatedById', wrapper.fieldApiName, 'Field API name should not be "CreatedById"');
            System.assertNotEquals('OwnerId', wrapper.fieldApiName, 'Field API name should not be "OwnerId"');
            System.assertNotEquals('LastModifiedById', wrapper.fieldApiName, 'Field API name should not be "LastModifiedById"');
            System.assertNotEquals('SystemModStamp', wrapper.fieldApiName, 'Field API name should not be "SystemModStamp"');
        }
    }
    
    @isTest
    static void testFetchContact() {
        List<Contact> contacts = new List<Contact>();
        for(Integer i = 0; i < 10; i++) {
            contacts.add(new Contact(
                FirstName = 'TestFirstName' + i,
                LastName = 'TestLastName' + i,
                Email = 'test' + i + '@example.com',
                AccountId = null
            ));
        }
        insert contacts;
        
        Test.startTest();
        List<Contact> result = adminUIFirstPartController.fetchContact();
        Test.stopTest();
        
        System.assertEquals(10, result.size(), 'Expected 10 contacts');
        for(Integer i = 0; i < 10; i++) {
            Contact contact = contacts[i];
            Contact returnedContact = result[i];
            System.assertEquals(contact.Email, returnedContact.Email, 'Email should match');
        }
    }*/
}