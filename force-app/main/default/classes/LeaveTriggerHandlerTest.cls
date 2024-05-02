@isTest
public class LeaveTriggerHandlerTest {
    @isTest
    static void testSendLeaveEmails(){
        Account accRecord = new Account(Name = 'Test Account');
        INSERT accRecord;
        
         Staff__c staffRecord = new Staff__c(
            Name = 'Test Employee',
            Staff_Type__c = 'Driver',
            Gender__c = 'Male',
            Profile__c = 'Employee'
        );
        INSERT staffRecord;
        
        Teacher__c teacherRecord = new Teacher__c(
            Name = 'Test Teacher',
            First_Name__c = 'TestFirstName',
            School__c = accRecord.Id,
            Gender__c = 'Male',
            Profile__c = 'Teacher',
            Email__c = 'teacher@aifly.io',
            Role__c = 'System administrator'
        );
        INSERT teacherRecord;
        System.debug('teacherRecord;::>>>>>' + teacherRecord.Teacher_SN__c);
        
        Leave__c oldLeaves = new Leave__c(
            Name = 'Test Leave',
            Status__c = 'Pending',
            To__c = teacherRecord.Id,
            From_Date__c = Date.today(),
            Sessions__c = 'Before Lunch Break',
            To_Date__c = Date.today().addDays(2),
            CC__c = teacherRecord.Teacher_SN__c,
            Staff__c = staffRecord.Id,
            Multi_Select_Teacher__c = teacherRecord.Id
        );
        INSERT oldLeaves;
        // Call the method
        Test.startTest();
        LeaveTriggerHandler.sendLeaveEmails(new List<Leave__c>{oldLeaves});
        Test.stopTest();
        
    }
    
    @isTest
    static void testLeaveTriggerHandler(){
        // Test data setup
        Account accRecord = new Account(Name = 'Test Account');
        INSERT accRecord;
        
        Account accRecords = new Account(Name = 'Test Account 1');
        INSERT accRecords;
        
        Teacher__c techRecord = new Teacher__c(
            Name = 'Test Teacher',
            First_Name__c = 'TestFirstName',
            School__c = accRecord.Id,
            Gender__c = 'Male',
            Profile__c = 'Teacher',
            Email__c = 'prem@aifly.io',
            Role__c = 'System administrator'
        );
        INSERT techRecord;
        
        Teacher__c techRecords = new Teacher__c(
            Name = 'Test Teacher1',
            First_Name__c = 'TestFirstName1',
            School__c = accRecords.Id,
            Gender__c = 'Female',
            Profile__c = 'Teacher',
            Email__c = 'sher@aifly.io',
            Role__c = 'System administrator'
        );
        INSERT techRecords;
        
        
        Staff__c staffRecord = new Staff__c(
            Name = 'Test Employee',
            Staff_Type__c = 'Driver',
            Gender__c = 'Male',
            Profile__c = 'Employee'
        );
        INSERT staffRecord;
        
        
        List<Leave__c> newLeaves = new List<Leave__c>{
            new Leave__c(
                Name = 'Test Leave',
                Status__c = 'Pending',
                To__c = techRecord.Id,
                From_Date__c = Date.today(),
                Sessions__c = 'Before Lunch Break',
                To_Date__c = Date.today().addDays(2),
                Staff__c = staffRecord.Id,
                Multi_Select_Teacher__c = techRecords.Id
            )
                };
                    INSERT newLeaves;
        
        // Test execution
        Test.startTest();
        LeaveTriggerHandler.updateTeacherTotalLeave(newLeaves);
        Test.stopTest();
        
        // Verification
        List<Teacher__c> updatedTeachers = [SELECT Id, Total__c FROM Teacher__c WHERE ID IN (:techRecord.Id, :techRecords.Id)];
        
        for (Teacher__c teacher : updatedTeachers) {
            if (teacher.Id == techRecord.Id) {
                System.assertEquals(null, teacher.Total__c, 'Expected Total__c to be 1 for techRecord');
            } else if (teacher.Id == techRecords.Id) {
                System.assertEquals(1, teacher.Total__c, 'Expected Total__c to be 1 for techRecords');
            }
        }
    }
    
    @isTest
    static void testHandleLeaveChanges(){
        // Test data setup
        Account accRecords = new Account(Name = 'Test Account 1');
        INSERT accRecords;
        
        Teacher__c techRecord = new Teacher__c(
            Name = 'Test Teacher',
            First_Name__c = 'TestFirstName',
            School__c = accRecords.Id,
            Gender__c = 'Male',
            Profile__c = 'Teacher',
            Email__c = 'prem@aifly.io',
            Role__c = 'System administrator'
        );
        INSERT techRecord;
        
        Teacher__c techRecords = new Teacher__c(
            Name = 'Test Teacher1',
            First_Name__c = 'TestFirstName1',
            School__c = accRecords.Id,
            Gender__c = 'Female',
            Profile__c = 'Teacher',
            Email__c = 'sher@aifly.io',
            Role__c = 'System administrator'
        );
        INSERT techRecords;
        
        
        Staff__c staffRecord = new Staff__c(
            Name = 'Test Employee',
            Staff_Type__c = 'Driver',
            Gender__c = 'Male',
            Profile__c = 'Employee'
        );
        INSERT staffRecord;
        
        
        Leave__c oldLeaves = new Leave__c(
            Name = 'Test Leave',
            Status__c = 'Pending',
            To__c = techRecord.Id,
            From_Date__c = Date.today(),
            Sessions__c = 'Before Lunch Break',
            To_Date__c = Date.today().addDays(2),
            Staff__c = staffRecord.Id,
            Multi_Select_Teacher__c = techRecord.Id
        );
        INSERT oldLeaves;
        oldLeaves.Status__c = 'Approved';
        Update oldLeaves;
        List<Leave__c> newLeaves = new List<Leave__c>{
            new Leave__c(
                Name = 'Test Leave',
                Status__c = 'Rejected',
                To__c = techRecord.Id,
                From_Date__c = Date.today(),
                Sessions__c = 'Before Lunch Break',
                To_Date__c = Date.today().addDays(2),
                Staff__c = staffRecord.Id,
                Multi_Select_Teacher__c = techRecords.Id
            )
                };
                    INSERT newLeaves;
        
        Map<Id, Leave__c> oldLeavesMap = new Map<Id, Leave__c>([SELECT Id, Status__c FROM Leave__c]);
        
        // Test execution
        Test.startTest();
        LeaveTriggerHandler.handleLeaveChanges(newLeaves, oldLeavesMap);
        Test.stopTest();
        
        // Verification
        // Verify the expected behavior
    }
}