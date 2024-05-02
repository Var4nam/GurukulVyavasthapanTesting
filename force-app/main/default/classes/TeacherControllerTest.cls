@isTest
public class TeacherControllerTest {
    
    @isTest
    static void testTeacherController(){
        List<Announcement__c> announceList = new List<Announcement__c>{
            new Announcement__c(Name = 'Test Announcement 1', Status__c = 'Pending', Description__c = 'Test Description 1', Type__c = 'Exam'),
                new Announcement__c(Name = 'Test Announcement 2', Status__c = 'Pending', Description__c = 'Test Description 2', Type__c = 'Game')
                };
                    
                    INSERT announceList;
        
        Test.startTest();
        List<Announcement__c> result = TeacherController.getAnnouncementRecords('Pending');
        Test.stopTest();
        
        System.assertEquals(2, result.size(), 'Expected two active announcement records to be fetched');
        System.assertEquals('Test Announcement 1', result[0].Name, 'Unexpected announcement name');
        System.assertEquals('Test Announcement 2', result[1].Name, 'Unexpected announcement name');
    }
    
}