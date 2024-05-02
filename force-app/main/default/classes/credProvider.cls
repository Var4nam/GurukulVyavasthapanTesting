public class credProvider {
    private static FINAL String SPACE = ' ';
    private static FINAL String DOT = '.';
    
    public static void credCreation(List<sObject> sobj){
        List<Staff__c> staffList = new List<Staff__c>();
        List<Student__c> studList = new List<Student__c>();
        List<Teacher__c> teachList = new List<Teacher__c>();
        List<Parent_Guardian__c> parenGuardList = new List<Parent_Guardian__c>();
        for(SObject s : sobj){
            if(sobj.getSObjectType() == Staff__c.SObjectType){
                staffList.add((Staff__c)s);
            }
            if(sobj.getSObjectType() == Student__c.SObjectType){    
                studList.add((Student__c)s);
            }
            if(sobj.getSObjectType() == Teacher__c.SObjectType){
                teachList.add((Teacher__c)s);
            }
            if(sobj.getSObjectType() == Parent_Guardian__c.SObjectType){
                parenGuardList.add((Parent_Guardian__c)s);
            }
        }
        if(staffList.size()>0){
            credProvider.credCreationStaff(staffList);
        }
        if(studList.size()>0){
            credProvider.credCreationStudent(studList);
        }
        if(teachList.size()>0){
            credProvider.credCreationTeacher(teachList);
        }
        if(parenGuardList.size()>0){
            credProvider.credCreationParent_Guardian(parenGuardList);
        }
    }
    
    public static void credCreationStaff(List<Staff__c> staffList){
        credProvider pass = new credProvider();
        List<Authentication__c> toInsertList = new List<Authentication__c>();
        for(Staff__c staff: staffList){
            Authentication__c auth = new Authentication__c();
            auth.Name = credProvider.usernameGenerator(staff.Name.normalizeSpace().toLowerCase());
            auth.Passphrase__c = pass.passphraseGenerator(staff.Id, (staff.Name).deleteWhitespace().toLowerCase()+'123');
            auth.Staff__c = staff.Id;
            toInsertList.add(auth);
        }
        if(toInsertList.size()>0 && Schema.sObjectType.Authentication__c.isAccessible()){
            Database.insert(toInsertList, false); 
        }
    }
    
    public static void credCreationStudent(List<Student__c> studList){
        credProvider pass = new credProvider();
        List<Authentication__c> toInsertList = new List<Authentication__c>();
        for(Student__c stud: studList){
            Authentication__c auth = new Authentication__c();
            auth.Name = credProvider.usernameGenerator(stud.Name.normalizeSpace().toLowerCase());
            auth.Passphrase__c = pass.passphraseGenerator(stud.Id, (stud.Name).deleteWhitespace().toLowerCase()+'123');
            auth.Student__c = stud.Id;
            toInsertList.add(auth);
        }
        if(toInsertList.size()>0 && Schema.sObjectType.Authentication__c.isAccessible()){
            Database.insert(toInsertList, false); 
        }
    }
    
    public static void credCreationTeacher(List<Teacher__c> teachList){
        credProvider pass = new credProvider();
        List<Authentication__c> toInsertList = new List<Authentication__c>();
        for(Teacher__c teach: teachList){
            Authentication__c auth = new Authentication__c();
            auth.Name = credProvider.usernameGenerator(teach.Name.normalizeSpace().toLowerCase());
            auth.Passphrase__c = pass.passphraseGenerator(teach.Id, (teach.Name).deleteWhitespace().toLowerCase()+'123');
            auth.Teacher__c = teach.Id;
            toInsertList.add(auth);
        }
        if(toInsertList.size()>0 && Schema.sObjectType.Authentication__c.isAccessible()){
            Database.insert(toInsertList, false);
        }
    }
    
    public static void credCreationParent_Guardian(List<Parent_Guardian__c> parenGuardList){
        
    }
    
    private static String usernameGenerator(String name){
        String finalUname, uname, lname = '';
        try{
            do{
                if(name.containsWhitespace()){
                    uname = name.substringBefore(SPACE) + DOT + (name.substringAfter(SPACE)).left(1);
                }else{
                    uname = name;
                }
                Final String chars = String.valueOf(system.currentTimeMillis());
                String randStr = '';
                while(randStr.length() < 4){
                    Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
                    randStr += chars.substring(idx, idx+1);
                }
                finalUname = uname+randStr;  
            }while(!isUniqueUsername(uname));
        } catch(Exception e){
            system.debug(e);
        }
        return finalUname;
    }
    
    private static boolean isUniqueUsername(String uname){
        boolean isUnique;
        String isUnamePresent = [SELECT Name FROM Authentication__c WHERE Name =: uname LIMIT 1]?.Name;
        if(String.isBlank(isUnamePresent)){
            isUnique = true;
        }else{
            isUnique = false;
        }
        return isUnique;
    }
    
    private String passphraseGenerator(Id sId, String phrase){
        List<String> str = new List<String>{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
            Integer randInt = Math.mod(Math.abs(Crypto.getRandomInteger()), str.size());
        Blob mainBlob = Blob.valueOf(sId+phrase);
        Blob hashBlob = Crypto.generateDigest('SHA3-512', mainBlob);
        String hashStr = EncodingUtil.base64Encode(hashBlob);
        String mainStr = hashStr.left(hashStr.length()-(hashStr.length()/(5)))+'B&yk-'+str.get(randInt)+hashStr.right(hashStr.length()/(5));
        return mainStr;
    }
}