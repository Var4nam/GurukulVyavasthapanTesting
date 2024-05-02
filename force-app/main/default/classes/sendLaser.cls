public class sendLaser implements Queueable, Database.AllowsCallouts, Finalizer{
    
    private List<Student__c> stud = new List<Student__c>();
    private List<Teacher__c> teach = new List<Teacher__c>();
    private List<Staff__c> staff = new List<Staff__c>();
    private List<Authentication__c> auth = new List<Authentication__c>();
    
    public sendLaser(List<SObject> sObj){
        if(sObj.size()>0){
            for(Sobject s : sObj){
                if(s.getSObjectType() == Student__c.SObjectType){
                    stud.add((Student__c)s);
                }
                if(s.getSObjectType() == Teacher__c.SObjectType){
                    teach.add((Teacher__c)s);
                } 
                if(s.getSObjectType() == Staff__c.SObjectType){
                    staff.add((Staff__c)s);
                }
                if(s.getSObjectType() == Authentication__c.SObjectType){
                    auth.add((Authentication__c)s);
                }
            }
        }
    }

    public void execute(QueueableContext context){
        Map<String, Object> obj = new Map<String, Object>();
        obj.put('data','This is testing');
        HttpRequest req = new HttpRequest();        
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint('callout:LaserCred/creator');
        req.setBody(JSON.Serialize(obj));
        Http http = new Http();
        HttpResponse res = http.send(req);
        system.debug(req.toString());
        system.debug(res.getBody());
    }
    
    public void execute(FinalizerContext context){
        
    }
}