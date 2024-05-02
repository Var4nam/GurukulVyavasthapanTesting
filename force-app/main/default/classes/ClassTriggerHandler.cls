public class ClassTriggerHandler {

    public static void createPublishRelatedToClass(List<Class__c> classList) {
        List<Publish__c> publishListToInsert = new List<Publish__c>();
        for(Class__c cs : classList) {
            publishListToInsert.add(new Publish__c(Class__c = cs.Name));
        }
        if(schema.sObjectType.Publish__c.isCreateable()) {
            if(!publishListToInsert.isEmpty()) {
                insert publishListToInsert;
            }   
        }
    }
}