�
ED:\Development\FJT\FJT-DEV\FJT.AutoBackup\Email Service\EmailModel.cs
	namespace 	
FJT
 
. 

AutoBackup 
. 
Email_Service &
{ 
public		 

class		 

EmailModel		 
{

 
public 
string  
mailSendProviderType *
{+ ,
get- 0
;0 1
set2 5
;5 6
}7 8
public 
string 
From 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
To 
{ 
get 
; 
set  #
;# $
}% &
public 
string 
CC 
{ 
get 
; 
set  #
;# $
}% &
public 
string 
BCC 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 
Subject 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
Body 
{ 
get  
;  !
set" %
;% &
}' (
public 
List 
< 
string 
> 
Attachments '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} �
GD:\Development\FJT\FJT-DEV\FJT.AutoBackup\Email Service\EmailService.cs
	namespace 	
FJT
 
. 

AutoBackup 
{ 
public 

class 
EmailService 
{ 
IModel 
channel 
= 
null 
; 
public 
static 
IConnection !

connection" ,
=- .
null/ 3
;3 4
string 
DirectivesTopic 
=   
ConfigurationManager! 5
.5 6
AppSettings6 A
[A B
$strB T
]T U
.U V
ToStringV ^
(^ _
)_ `
;` a
string 
rabbitMqURI 
=  
ConfigurationManager 1
.1 2
AppSettings2 =
[= >
$str> K
]K L
.L M
ToStringM U
(U V
)V W
;W X
public 
void 
	SendEmail 
( 

EmailModel (
model) .
). /
{ 	
ConnectionFactory 
factory %
=& '
new( +
ConnectionFactory, =
(= >
)> ?
;? @
factory 
. $
AutomaticRecoveryEnabled ,
=- .
true/ 3
;3 4
factory 
. 
Uri 
= 
new 
Uri !
(! "
rabbitMqURI" -
)- .
;. /
factory 
. 
UserName 
=  
ConfigurationManager 3
.3 4
AppSettings4 ?
[? @
$str@ R
]R S
;S T
factory 
. 
Password 
=  
ConfigurationManager 3
.3 4
AppSettings4 ?
[? @
$str@ R
]R S
;S T
factory 
. 
HostName 
=  
ConfigurationManager 3
.3 4
AppSettings4 ?
[? @
$str@ S
]S T
;T U
factory 
. 
VirtualHost 
=  ! 
ConfigurationManager" 6
.6 7
AppSettings7 B
[B C
$strC ]
]] ^
;^ _

connection   
=   
factory    
.    !
CreateConnection  ! 1
(  1 2
)  2 3
;  3 4
channel!! 
=!! 

connection!!  
.!!  !
CreateModel!!! ,
(!!, -
)!!- .
;!!. /
model"" 
.""  
mailSendProviderType"" &
=""' (
$str"") 2
;""2 3
string## 
	jsonified## 
=## 
JsonConvert## *
.##* +
SerializeObject##+ :
(##: ;
model##; @
)##@ A
;##A B
var$$ 
body$$ 
=$$ 
Encoding$$ 
.$$  
UTF8$$  $
.$$$ %
GetBytes$$% -
($$- .
	jsonified$$. 7
)$$7 8
;$$8 9
var%% 

properties%% 
=%% 
channel%% $
.%%$ %!
CreateBasicProperties%%% :
(%%: ;
)%%; <
;%%< =
channel&& 
.&& 
BasicPublish&&  
(&&  !
string&&! '
.&&' (
Empty&&( -
,&&- .
DirectivesTopic&&/ >
,&&> ?

properties&&@ J
,&&J K
body&&L P
)&&P Q
;&&Q R
}'' 	
}(( 
})) �
ID:\Development\FJT\FJT-DEV\FJT.AutoBackup\Email Service\ResponseResult.cs
	namespace 	
FJT
 
. 

AutoBackup 
. 
Email_Service &
{ 
public		 

class		 
ResponseResult		 
{

 
public 
string 
status 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
errors 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
userMessage !
{" #
get$ '
;' (
set) ,
;, -
}. /
} 
} �5
SD:\Development\FJT\FJT-DEV\FJT.AutoBackup\FileSystemHelper\ConnectToSharedFolder.cs
	namespace

 	
FJT


 
.

 

AutoBackup

 
.

 
FileSystemHelper

 )
{ 
public 

class !
ConnectToSharedFolder &
:' (
IDisposable) 4
{ 
readonly 
string 
_networkName $
;$ %
public !
ConnectToSharedFolder $
($ %
string% +
networkName, 7
,7 8
NetworkCredential9 J
credentialsK V
)V W
{ 	
_networkName 
= 
networkName &
;& '
var 
netResource 
= 
new !
NetResource" -
{ 
Scope 
= 
ResourceScope %
.% &
GlobalNetwork& 3
,3 4
ResourceType 
= 
ResourceType +
.+ ,
Disk, 0
,0 1
DisplayType 
= 
ResourceDisplaytype 1
.1 2
	Directory2 ;
,; <

RemoteName 
= 
networkName (
} 
; 
var 
userName 
= 
string !
.! "
IsNullOrEmpty" /
(/ 0
credentials0 ;
.; <
Domain< B
)B C
? 
credentials 
. 
UserName &
: 
string 
. 
Format 
(  
$str  *
,* +
credentials, 7
.7 8
Domain8 >
,> ?
credentials@ K
.K L
UserNameL T
)T U
;U V
var   
result   
=   
WNetAddConnection2   +
(  + ,
netResource!! 
,!! 
credentials"" 
."" 
Password"" $
,""$ %
userName## 
,## 
$num$$ 
)$$ 
;$$ 
if'' 
('' 
result'' 
!='' 
$num'' 
)'' 
{(( 
throw)) 
new)) 
Win32Exception)) (
())( )
result))) /
,))/ 0
$str))1 U
)))U V
;))V W
}** 
}++ 	
~-- 	!
ConnectToSharedFolder--	 
(-- 
)--  
{.. 	
Dispose// 
(// 
false// 
)// 
;// 
}00 	
public11 
void11 
Dispose11 
(11 
)11 
{22 	
Dispose33 
(33 
true33 
)33 
;33 
GC44 
.44 
SuppressFinalize44 
(44  
this44  $
)44$ %
;44% &
}55 	
	protected66 
virtual66 
void66 
Dispose66 &
(66& '
bool66' +
	disposing66, 5
)665 6
{77 	!
WNetCancelConnection288 !
(88! "
_networkName88" .
,88. /
$num880 1
,881 2
true883 7
)887 8
;888 9
}99 	
[:: 	
	DllImport::	 
(:: 
$str:: 
):: 
]:: 
private;; 
static;; 
extern;; 
int;; !
WNetAddConnection2;;" 4
(;;4 5
NetResource;;5 @
netResource;;A L
,;;L M
string;;N T
password;;U ]
,;;] ^
string;;_ e
username;;f n
,;;n o
int;;p s
flags;;t y
);;y z
;;;z {
[== 	
	DllImport==	 
(== 
$str== 
)== 
]== 
private>> 
static>> 
extern>> 
int>> !!
WNetCancelConnection2>>" 7
(>>7 8
string>>8 >
name>>? C
,>>C D
int>>E H
flags>>I N
,>>N O
bool>>P T
force>>U Z
)>>Z [
;>>[ \
[@@ 	
StructLayout@@	 
(@@ 

LayoutKind@@  
.@@  !

Sequential@@! +
)@@+ ,
]@@, -
publicAA 
classAA 
NetResourceAA  
{BB 	
publicCC 
ResourceScopeCC  
ScopeCC! &
;CC& '
publicDD 
ResourceTypeDD 
ResourceTypeDD  ,
;DD, -
publicEE 
ResourceDisplaytypeEE &
DisplayTypeEE' 2
;EE2 3
publicFF 
intFF 
UsageFF 
;FF 
publicGG 
stringGG 
	LocalNameGG #
;GG# $
publicHH 
stringHH 

RemoteNameHH $
;HH$ %
publicII 
stringII 
CommentII !
;II! "
publicJJ 
stringJJ 
ProviderJJ "
;JJ" #
}KK 	
;KK	 

publicLL 
enumLL 
ResourceScopeLL !
:LL" #
intLL$ '
{MM 	
	ConnectedNN 
=NN 
$numNN 
,NN 
GlobalNetworkOO 
,OO 

RememberedPP 
,PP 
RecentQQ 
,QQ 
ContextRR 
}SS 	
;SS	 

publicTT 
enumTT 
ResourceTypeTT  
:TT! "
intTT# &
{UU 	
AnyVV 
=VV 
$numVV 
,VV 
DiskWW 
=WW 
$numWW 
,WW 
PrintXX 
=XX 
$numXX 
,XX 
ReservedYY 
=YY 
$numYY 
,YY 
}ZZ 	
;ZZ	 

public[[ 
enum[[ 
ResourceDisplaytype[[ '
:[[( )
int[[* -
{\\ 	
Generic]] 
=]] 
$num]] 
,]] 
Domain^^ 
=^^ 
$num^^ 
,^^ 
Server__ 
=__ 
$num__ 
,__ 
Share`` 
=`` 
$num`` 
,`` 
Fileaa 
=aa 
$numaa 
,aa 
Groupbb 
=bb 
$numbb 
,bb 
Networkcc 
=cc 
$numcc 
,cc 
Rootdd 
=dd 
$numdd 
,dd 

Shareadminee 
=ee 
$numee 
,ee 
	Directoryff 
=ff 
$numff 
,ff 
Treegg 
=gg 
$numgg 
,gg 
Ndscontainerhh 
=hh 
$numhh 
}ii 	
;ii	 

}jj 
}kk ϲ
4D:\Development\FJT\FJT-DEV\FJT.AutoBackup\Program.cs
	namespace 	
FJT
 
. 

AutoBackup 
{ 
class 	
Program
 
{ 
static 
string 
_adminEmailID #
=$ %#
WebConfigurationManager& =
.= >
AppSettings> I
[I J
$strJ X
]X Y
.Y Z
ToStringZ b
(b c
)c d
;d e
public 
static 
class 
Globals #
{ 	
public 
static 
bool %
boolMysqlBackupSuccessful 8
=9 :
false; @
;@ A
public 
static 
bool -
!boolMysqlIdentityBackupSuccessful @
=A B
falseC H
;H I
public 
static 
bool %
boolMongoBackupSuccessful 8
=9 :
false; @
;@ A
public 
static 
bool -
!boolElasticSearchBackupSuccessful @
=A B
falseC H
;H I
public   
static   
bool   &
boolFolderBackupSuccessful   9
=  : ;
false  < A
;  A B
public!! 
static!! 
bool!! )
boolDatasheetBackupSuccessful!! <
=!!= >
false!!? D
;!!D E
public"" 
static"" 
bool"" 
boolNotAException"" 0
=""1 2
true""3 7
;""7 8
public## 
static## 
bool## #
boolTakeDatasheetBackup## 6
=##7 8
false##9 >
;##> ?
public%% 
static%% 
DateTime%% "
_today%%# )
=%%* +
DateTime%%, 4
.%%4 5
Now%%5 8
;%%8 9
public&& 
static&& 
string&&  
_scanDocuFilePath&&! 2
=&&3 4#
WebConfigurationManager&&5 L
.&&L M
AppSettings&&M X
[&&X Y
$str&&Y g
]&&g h
.&&h i
ToString&&i q
(&&q r
)&&r s
;&&s t
public'' 
static'' 
string''  
_MysqlDBName''! -
=''. /#
WebConfigurationManager''0 G
.''G H
AppSettings''H S
[''S T
$str''T a
]''a b
.''b c
ToString''c k
(''k l
)''l m
;''m n
public(( 
static(( 
string((   
_MysqlIdentityDBName((! 5
=((6 7#
WebConfigurationManager((8 O
.((O P
AppSettings((P [
[(([ \
$str((\ q
]((q r
.((r s
ToString((s {
((({ |
)((| }
;((} ~
public)) 
static)) 
string))   
_mongoDbDatabaseName))! 5
=))6 7#
WebConfigurationManager))8 O
.))O P
AppSettings))P [
[))[ \
$str))\ q
]))q r
.))r s
ToString))s {
()){ |
)))| }
;))} ~
public** 
static** 
string**  
_elasticIndicesName**! 4
=**5 6#
WebConfigurationManager**7 N
.**N O
AppSettings**O Z
[**Z [
$str**[ o
]**o p
.**p q
ToString**q y
(**y z
)**z {
;**{ |
public++ 
static++ 
string++   
_backupSystemDetails++! 5
=++6 7#
WebConfigurationManager++8 O
.++O P
AppSettings++P [
[++[ \
$str++\ q
]++q r
.++r s
ToString++s {
(++{ |
)++| }
;++} ~
public,, 
static,, 
string,,  $
isTakeBackupUploadFolder,,! 9
=,,: ;#
WebConfigurationManager,,< S
.,,S T
AppSettings,,T _
[,,_ `
$str,,` x
],,x y
.,,y z
ToString	,,z �
(
,,� �
)
,,� �
;
,,� �
public-- 
static-- 
string--  
_psFilePath--! ,
=--- .#
WebConfigurationManager--/ F
.--F G
AppSettings--G R
[--R S
$str--S c
]--c d
.--d e
ToString--e m
(--m n
)--n o
;--o p
public.. 
static.. 
string..  
_datasheetFilePath..! 3
=..4 5#
WebConfigurationManager..6 M
...M N
AppSettings..N Y
[..Y Z
$str..Z s
]..s t
...t u
ToString..u }
(..} ~
)..~ 
;	.. �
public// 
static// 
string//  $
_takeDatasheetBackupDays//! 9
=//: ;#
WebConfigurationManager//< S
.//S T
AppSettings//T _
[//_ `
$str//` y
]//y z
.//z {
ToString	//{ �
(
//� �
)
//� �
;
//� �
public00 
static00 
string00  
_isCompressedBackup00! 4
=005 6#
WebConfigurationManager007 N
.00N O
AppSettings00O Z
[00Z [
$str00[ o
]00o p
.00p q
ToString00q y
(00y z
)00z {
;00{ |
public11 
static11 
string11  
_7ZipExeFilePath11! 1
=112 3#
WebConfigurationManager114 K
.11K L
AppSettings11L W
[11W X
$str11X i
]11i j
.11j k
ToString11k s
(11s t
)11t u
;11u v
public22 
static22 
string22  $
_compressedFileExtension22! 9
=22: ;#
WebConfigurationManager22< S
.22S T
AppSettings22T _
[22_ `
$str22` y
]22y z
.22z {
ToString	22{ �
(
22� �
)
22� �
;
22� �
public33 
static33 
string33  
_mySqlServiceName33! 2
=333 4#
WebConfigurationManager335 L
.33L M
AppSettings33M X
[33X Y
$str33Y k
]33k l
.33l m
ToString33m u
(33u v
)33v w
;33w x
public44 
static44 
string44  
_mongoDBServiceName44! 4
=445 6#
WebConfigurationManager447 N
.44N O
AppSettings44O Z
[44Z [
$str44[ o
]44o p
.44p q
ToString44q y
(44y z
)44z {
;44{ |
public55 
static55 
string55  %
_elasticsearchServiceName55! :
=55; <#
WebConfigurationManager55= T
.55T U
AppSettings55U `
[55` a
$str55a {
]55{ |
.55| }
ToString	55} �
(
55� �
)
55� �
;
55� �
public66 
static66 
string66  
_mysqlBackupFile66! 1
,661 2 
_gZipMysqlBackupFile663 G
=66H I
null66J N
;66N O
public77 
static77 
string77  $
_mysqlIdentityBackupFile77! 9
,779 :(
_gZipMysqlIdentityBackupFile77; W
=77X Y
null77Z ^
;77^ _
public88 
static88 
string88  
_elasticBackupFile88! 3
=884 5
null886 :
;88: ;
public99 
static99 
string99  #
_uploadFolderBackupFile99! 8
=999 :
null99; ?
;99? @
public:: 
static:: 
string::  &
_datasheetFolderBackupFile::! ;
=::< =
null::> B
;::B C
public;; 
static;; 
string;;  
_backupFolderPath;;! 2
=;;3 4
string;;5 ;
.;;; <
Format;;< B
(;;B C
$str;;C T
+;;U V
$str;;W [
+;;\ ]
$str;;^ r
,;;r s
_scanDocuFilePath	;;t �
,
;;� �
_today
;;� �
,
;;� �
_today
;;� �
)
;;� �
;
;;� �
public<< 
static<< 
string<<   
_mysqlBackupFileSize<<! 5
,<<5 6 
_mongoBackupFileSize<<7 K
,<<K L"
_elasticBackupFileSize<<M c
,<<c d!
_folderBackupFileSize<<e z
,<<z {%
_datasheetBackupFileSize	<<| �
,
<<� �*
_mysqlIdentityBackupFileSize
<<� �
;
<<� �
public== 
static== 
string==   
_mysqlBackupFileTime==! 5
,==5 6 
_mongoBackupFileTime==7 K
,==K L"
_elasticBackupFileTime==M c
,==c d!
_folderBackupFileTime==e z
,==z {%
_datasheetBackupFileTime	==| �
,
==� �"
_deleteOldBackupTime
==� �
,
==� �*
_mysqlIdentityBackupFileTime
==� �
;
==� �
public>> 
static>> 
TimeSpan>> "!
_totalMySQLBackupTime>># 8
,>>8 9#
_totalMongoDBBackupTime>>: Q
,>>Q R#
_totalElasticBackupTime>>S j
,>>j k#
_totalFolderBackupTime	>>l �
,
>>� �'
_totalDataSheetBackupTime
>>� �
,
>>� �&
_totalExternalBackupTime
>>� �
,
>>� �
_totalBackupTime
>>� �
,
>>� �'
_totalDeleteOldBackupTime
>>� �
,
>>� �+
_totalMySQLIdentityBackupTime
>>� �
;
>>� �
public?? 
static?? 
string??  
_backupDriveSpace??! 2
,??2 3%
_externalBackupDriveSpace??4 M
,??M N!
_driveNotFoundMessage??O d
;??d e
public@@ 
static@@ 
string@@  
_errorStackTrace@@! 1
=@@2 3
$str@@4 6
;@@6 7
}AA 	
staticCC 
asyncCC 
TaskCC 
MainCC 
(CC 
stringCC %
[CC% &
]CC& '
argsCC( ,
)CC, -
{DD 	
GlobalsFF 
.FF  
_mysqlBackupFileSizeFF (
=FF) *
GlobalsFF+ 2
.FF2 3 
_mongoBackupFileSizeFF3 G
=FFH I
GlobalsFFJ Q
.FFQ R"
_elasticBackupFileSizeFFR h
=FFi j
GlobalsFFk r
.FFr s"
_folderBackupFileSize	FFs �
=
FF� �
Globals
FF� �
.
FF� �&
_datasheetBackupFileSize
FF� �
=
FF� �
Globals
FF� �
.
FF� �*
_mysqlIdentityBackupFileSize
FF� �
=
FF� �
$str
FF� �
;
FF� �
GlobalsGG 
.GG  
_mysqlBackupFileTimeGG (
=GG) *
GlobalsGG+ 2
.GG2 3 
_mongoBackupFileTimeGG3 G
=GGH I
GlobalsGGJ Q
.GGQ R"
_elasticBackupFileTimeGGR h
=GGi j
GlobalsGGk r
.GGr s"
_folderBackupFileTime	GGs �
=
GG� �
Globals
GG� �
.
GG� �&
_datasheetBackupFileTime
GG� �
=
GG� �
Globals
GG� �
.
GG� �"
_deleteOldBackupTime
GG� �
=
GG� �
Globals
GG� �
.
GG� �*
_mysqlIdentityBackupFileTime
GG� �
=
GG� �
$str
GG� �
;
GG� �
GlobalsHH 
.HH !
_totalMySQLBackupTimeHH )
=HH* +
GlobalsHH, 3
.HH3 4#
_totalMongoDBBackupTimeHH4 K
=HHL M
GlobalsHHN U
.HHU V#
_totalElasticBackupTimeHHV m
=HHn o
GlobalsHHp w
.HHw x#
_totalFolderBackupTime	HHx �
=
HH� �
Globals
HH� �
.
HH� �'
_totalDataSheetBackupTime
HH� �
=
HH� �
Globals
HH� �
.
HH� �&
_totalExternalBackupTime
HH� �
=
HH� �
Globals
HH� �
.
HH� �'
_totalDeleteOldBackupTime
HH� �
=
HH� �
Globals
HH� �
.
HH� �+
_totalMySQLIdentityBackupTime
HH� �
=
HH� �
TimeSpan
HH� �
.
HH� �
Zero
HH� �
;
HH� �
GlobalsII 
.II 
_backupDriveSpaceII %
=II& '
GlobalsII( /
.II/ 0%
_externalBackupDriveSpaceII0 I
=IIJ K
GlobalsIIL S
.IIS T!
_driveNotFoundMessageIIT i
=IIj k
$str	IIl �
;
II� �
tryJJ 
{KK 
ifLL 
(LL 
!LL 
stringLL 
.LL 
IsNullOrEmptyLL )
(LL) *
GlobalsLL* 1
.LL1 2$
_takeDatasheetBackupDaysLL2 J
)LLJ K
)LLK L
{MM 
stringNN 
[NN 
]NN 
_backupDaysNN (
=NN) *
GlobalsNN+ 2
.NN2 3$
_takeDatasheetBackupDaysNN3 K
.NNK L
ToUpperNNL S
(NNS T
)NNT U
.NNU V
SplitNNV [
(NN[ \
newNN\ _
charNN` d
[NNd e
]NNe f
{NNg h
$charNNi l
,NNl m
$charNNn q
}NNr s
,NNs t
StringSplitOptions	NNu �
.
NN� � 
RemoveEmptyEntries
NN� �
)
NN� �
;
NN� �
ifOO 
(OO 
_backupDaysOO #
.OO# $
ContainsOO$ ,
(OO, -
ConvertOO- 4
.OO4 5
ToStringOO5 =
(OO= >
GlobalsOO> E
.OOE F
_todayOOF L
.OOL M
	DayOfWeekOOM V
)OOV W
.OOW X
ToUpperOOX _
(OO_ `
)OO` a
)OOa b
)OOb c
{PP 
GlobalsQQ 
.QQ  #
boolTakeDatasheetBackupQQ  7
=QQ8 9
trueQQ: >
;QQ> ?
}RR 
}SS 
stringUU 
driveLetterUU "
=UU# $
PathUU% )
.UU) *
GetPathRootUU* 5
(UU5 6
GlobalsUU6 =
.UU= >
_scanDocuFilePathUU> O
)UUO P
;UUP Q
ifVV 
(VV 
!VV 
	DirectoryVV 
.VV 
ExistsVV %
(VV% &
driveLetterVV& 1
)VV1 2
)VV2 3
{WW 
GlobalsXX 
.XX  
_mysqlBackupFileSizeXX 0
=XX1 2
GlobalsXX3 :
.XX: ;(
_mysqlIdentityBackupFileSizeXX; W
=XXX Y
GlobalsXXZ a
.XXa b!
_driveNotFoundMessageXXb w
;XXw x
returnYY 
;YY 
}ZZ 
if]] 
(]] 
!]] 
	Directory]] 
.]] 
Exists]] %
(]]% &
string]]& ,
.]], -
Format]]- 3
(]]3 4
$str]]4 E
,]]E F
Globals]]G N
.]]N O
_scanDocuFilePath]]O `
,]]` a
Globals]]b i
.]]i j
_today]]j p
)]]p q
)]]q r
)]]r s
{^^ 
	Directory__ 
.__ 
CreateDirectory__ -
(__- .
string__. 4
.__4 5
Format__5 ;
(__; <
$str__< M
,__M N
Globals__O V
.__V W
_scanDocuFilePath__W h
,__h i
Globals__j q
.__q r
_today__r x
)__x y
)__y z
;__z {
}`` 
	Directorybb 
.bb 
CreateDirectorybb )
(bb) *
Globalsbb* 1
.bb1 2
_backupFolderPathbb2 C
)bbC D
;bbD E
varee 
uploadBackupTaskee $
=ee% &
Taskee' +
.ee+ ,
Factoryee, 3
.ee3 4
StartNewee4 <
(ee< =
(ee= >
)ee> ?
=>ee@ B'
TakeUploadFolderBackupAsynceeC ^
(ee^ _
driveLetteree_ j
)eej k
)eek l
;eel m
varff 
dataSheetBackupTaskff '
=ff( )
Taskff* .
.ff. /
Factoryff/ 6
.ff6 7
StartNewff7 ?
(ff? @
(ff@ A
)ffA B
=>ffC E*
TakeDataSheetFolderBackupAsyncffF d
(ffd e
driveLetterffe p
)ffp q
)ffq r
;ffr s
varjj 
mySQLDBBackupTaskjj %
=jj& '
Taskjj( ,
.jj, -
Factoryjj- 4
.jj4 5
StartNewjj5 =
(jj= >
(jj> ?
)jj? @
=>jjA C"
TakeMySQLDBBackupAsyncjjD Z
(jjZ [
)jj[ \
)jj\ ]
;jj] ^
varnn %
mySQLIdentityDBBackupTasknn -
=nn. /
Tasknn0 4
.nn4 5
Factorynn5 <
.nn< =
StartNewnn= E
(nnE F
(nnF G
)nnG H
=>nnI K*
TakeMySQLIdentityDBBackupAsyncnnL j
(nnj k
)nnk l
)nnl m
;nnm n
varrr 
mongoDBBackupTaskrr %
=rr& '
Taskrr( ,
.rr, -
Factoryrr- 4
.rr4 5
StartNewrr5 =
(rr= >
(rr> ?
)rr? @
=>rrA C"
TakeMongoDBBackupAsyncrrD Z
(rrZ [
)rr[ \
)rr\ ]
;rr] ^
varvv 
elasticDBBackupTaskvv '
=vv( )
Taskvv* .
.vv. /
Factoryvv/ 6
.vv6 7
StartNewvv7 ?
(vv? @
(vv@ A
)vvA B
=>vvC E$
TakeElasticDBBackupAsyncvvF ^
(vv^ _
)vv_ `
)vv` a
;vva b
awaityy 
Taskyy 
.yy 
WhenAllyy "
(yy" #
uploadBackupTaskyy# 3
,yy3 4
dataSheetBackupTaskyy5 H
,yyH I
mySQLDBBackupTaskyyJ [
,yy[ \
mongoDBBackupTaskyy] n
,yyn o 
elasticDBBackupTask	yyp �
,
yy� �'
mySQLIdentityDBBackupTask
yy� �
)
yy� �
;
yy� �
Consolezz 
.zz 
	WriteLinezz !
(zz! "
$strzz" 8
)zz8 9
;zz9 :
}{{ 
catch|| 
(|| 
AggregateException|| %
e||& '
)||' (
{}} 
Globals~~ 
.~~ 
_errorStackTrace~~ (
+=~~) +
string~~, 2
.~~2 3
Format~~3 9
(~~9 :
$str~~: Q
,~~Q R
e~~S T
.~~T U
Message~~U \
,~~\ ]
e~~^ _
.~~_ `

StackTrace~~` j
)~~j k
;~~k l
Globals 
. 
boolNotAException )
=* +
false, 1
;1 2
foreach
�� 
(
�� 
var
�� 
ex
�� 
in
��  "
e
��# $
.
��$ %
InnerExceptions
��% 4
)
��4 5
{
�� 
SaveErrorLog
��  
(
��  !
ex
��! #
)
��# $
;
��$ %
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
Globals
�� 
.
�� 
_errorStackTrace
�� (
+=
��) +
string
��, 2
.
��2 3
Format
��3 9
(
��9 :
$str
��: Q
,
��Q R
ex
��S U
.
��U V
Message
��V ]
,
��] ^
ex
��_ a
.
��a b

StackTrace
��b l
)
��l m
;
��m n
Globals
�� 
.
�� 
boolNotAException
�� )
=
��* +
false
��, 1
;
��1 2
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
finally
�� 
{
�� 
string
�� 
_subject
�� 
=
��  !
string
��" (
.
��( )
Empty
��) .
;
��. /
string
�� 
_body
�� 
=
�� 
string
�� %
.
��% &
Empty
��& +
;
��+ ,
try
�� 
{
�� 
bool
�� 

bkupStatus
�� #
=
��$ %
(
��& '
Globals
��' .
.
��. /
boolNotAException
��/ @
&&
��A C
Globals
��D K
.
��K L'
boolMysqlBackupSuccessful
��L e
&&
��f h
Globals
��i p
.
��p q(
boolMongoBackupSuccessful��q �
&&��� �
Globals��� �
.��� �1
!boolElasticSearchBackupSuccessful��� �
&&��� �
Globals��� �
.��� �1
!boolMysqlIdentityBackupSuccessful��� �
)��� �
;��� �
if
�� 
(
�� 

bkupStatus
�� "
==
��# %
true
��& *
&&
��+ -
Globals
��. 5
.
��5 6&
isTakeBackupUploadFolder
��6 N
==
��O Q
$str
��R U
&&
��V X
!
��Y Z
Globals
��Z a
.
��a b(
boolFolderBackupSuccessful
��b |
)
��| }
{
�� 

bkupStatus
�� "
=
��# $
false
��% *
;
��* +
}
�� 
if
�� 
(
�� 

bkupStatus
�� "
==
��# %
true
��& *
&&
��+ -
Globals
��. 5
.
��5 6%
boolTakeDatasheetBackup
��6 M
&&
��N P
!
��Q R
Globals
��R Y
.
��Y Z+
boolDatasheetBackupSuccessful
��Z w
)
��w x
{
�� 

bkupStatus
�� "
=
��# $
false
��% *
;
��* +
}
�� 
string
�� 
currentDate
�� &
=
��' (
DateTime
��) 1
.
��1 2
UtcNow
��2 8
.
��8 9
ToString
��9 A
(
��A B
$str
��B T
)
��T U
;
��U V
string
�� 
bodyMessage
�� &
=
��' (
(
��) *

bkupStatus
��* 4
==
��5 7
true
��8 <
)
��< =
?
��> ?
$str
��@ e
:
��f g
$str
��h }
;
��} ~
string
�� 
bodyCSSClass
�� '
=
��( )
(
��* +

bkupStatus
��+ 5
==
��6 8
true
��9 =
)
��= >
?
��? @
$str
��A J
:
��K L
$str
��M V
;
��V W
string
�� 
_fileSizeMessage
�� +
=
��, -
$str
��. E
;
��E F
string
��  
_backupTimeMessage
�� -
=
��. /
$str
��0 I
;
��I J
if
�� 
(
�� 
Globals
�� 
.
��  &
isTakeBackupUploadFolder
��  8
==
��9 ;
$str
��< ?
)
��? @
{
�� 
if
�� 
(
�� 
Globals
�� #
.
��# $(
boolFolderBackupSuccessful
��$ >
&&
��? A
Globals
��B I
.
��I J%
_uploadFolderBackupFile
��J a
!=
��b d
null
��e i
&&
��j l
	Directory
��m v
.
��v w
Exists
��w }
(
��} ~
Globals��~ �
.��� �'
_uploadFolderBackupFile��� �
)��� �
)��� �
{
�� 
double
�� "
size
��# '
=
��( )
GetDirectorySize
��* :
(
��: ;
Globals
��; B
.
��B C%
_uploadFolderBackupFile
��C Z
)
��Z [
;
��[ \
Globals
�� #
.
��# $#
_folderBackupFileSize
��$ 9
=
��: ;
string
��< B
.
��B C
Format
��C I
(
��I J
_fileSizeMessage
��J Z
,
��Z [
GetConvertedSize
��\ l
(
��l m
size
��m q
)
��q r
)
��r s
;
��s t
Globals
�� #
.
��# $#
_folderBackupFileTime
��$ 9
=
��: ;
string
��< B
.
��B C
Format
��C I
(
��I J 
_backupTimeMessage
��J \
,
��\ ]
GetTimeInText
��^ k
(
��k l
Globals
��l s
.
��s t%
_totalFolderBackupTime��t �
)��� �
)��� �
;��� �
}
�� 
}
�� 
if
�� 
(
�� 
Globals
�� 
.
��  %
boolTakeDatasheetBackup
��  7
)
��7 8
{
�� 
if
�� 
(
�� 
Globals
�� #
.
��# $+
boolDatasheetBackupSuccessful
��$ A
&&
��B D
Globals
��E L
.
��L M(
_datasheetFolderBackupFile
��M g
!=
��h j
null
��k o
&&
��p r
	Directory
��s |
.
��| }
Exists��} �
(��� �
Globals��� �
.��� �*
_datasheetFolderBackupFile��� �
)��� �
)��� �
{
�� 
double
�� "
size
��# '
=
��( )
GetDirectorySize
��* :
(
��: ;
Globals
��; B
.
��B C(
_datasheetFolderBackupFile
��C ]
)
��] ^
;
��^ _
Globals
�� #
.
��# $&
_datasheetBackupFileSize
��$ <
=
��= >
string
��? E
.
��E F
Format
��F L
(
��L M
_fileSizeMessage
��M ]
,
��] ^
GetConvertedSize
��_ o
(
��o p
size
��p t
)
��t u
)
��u v
;
��v w
Globals
�� #
.
��# $&
_datasheetBackupFileTime
��$ <
=
��= >
string
��? E
.
��E F
Format
��F L
(
��L M 
_backupTimeMessage
��M _
,
��_ `
GetTimeInText
��a n
(
��n o
Globals
��o v
.
��v w(
_totalDataSheetBackupTime��w �
)��� �
)��� �
;��� �
}
�� 
}
�� 
if
�� 
(
�� 
Globals
�� 
.
��  !
_isCompressedBackup
��  3
==
��4 6
$str
��7 :
)
��: ;
{
�� 
if
�� 
(
�� 
Globals
�� #
.
��# $'
boolMysqlBackupSuccessful
��$ =
&&
��> @
Globals
��A H
.
��H I"
_gZipMysqlBackupFile
��I ]
!=
��^ `
null
��a e
&&
�� 
File
�� 
.
��  
Exists
��  &
(
��& '
Globals
��' .
.
��. /"
_gZipMysqlBackupFile
��/ C
)
��C D
)
��D E
{
�� 
FileInfo
�� $
file
��% )
=
��* +
new
��, /
FileInfo
��0 8
(
��8 9
Globals
��9 @
.
��@ A"
_gZipMysqlBackupFile
��A U
)
��U V
;
��V W
double
�� "
size
��# '
=
��( )
Math
��* .
.
��. /
Round
��/ 4
(
��4 5
(
��5 6
(
��6 7
double
��7 =
)
��= >
file
��> B
.
��B C
Length
��C I
/
��J K
$num
��L P
/
��Q R
$num
��S W
)
��W X
,
��X Y
$num
��Z [
)
��[ \
;
��\ ]
Globals
�� #
.
��# $"
_mysqlBackupFileSize
��$ 8
=
��9 :
string
��; A
.
��A B
Format
��B H
(
��H I
_fileSizeMessage
��I Y
,
��Y Z
GetConvertedSize
��[ k
(
��k l
size
��l p
)
��p q
)
��q r
;
��r s
Globals
�� #
.
��# $"
_mysqlBackupFileTime
��$ 8
=
��9 :
string
��; A
.
��A B
Format
��B H
(
��H I 
_backupTimeMessage
��I [
,
��[ \
GetTimeInText
��] j
(
��j k
Globals
��k r
.
��r s$
_totalMySQLBackupTime��s �
)��� �
)��� �
;��� �
}
�� 
if
�� 
(
�� 
Globals
�� #
.
��# $/
!boolMysqlIdentityBackupSuccessful
��$ E
&&
��F H
Globals
��I P
.
��P Q*
_gZipMysqlIdentityBackupFile
��Q m
!=
��n p
null
��q u
&&
��v x
File
��y }
.
��} ~
Exists��~ �
(��� �
Globals��� �
.��� �,
_gZipMysqlIdentityBackupFile��� �
)��� �
)��� �
{
�� 
FileInfo
�� $
file
��% )
=
��* +
new
��, /
FileInfo
��0 8
(
��8 9
Globals
��9 @
.
��@ A*
_gZipMysqlIdentityBackupFile
��A ]
)
��] ^
;
��^ _
double
�� "
size
��# '
=
��( )
Math
��* .
.
��. /
Round
��/ 4
(
��4 5
(
��5 6
(
��6 7
double
��7 =
)
��= >
file
��> B
.
��B C
Length
��C I
/
��J K
$num
��L P
/
��Q R
$num
��S W
)
��W X
,
��X Y
$num
��Z [
)
��[ \
;
��\ ]
Globals
�� #
.
��# $*
_mysqlIdentityBackupFileSize
��$ @
=
��A B
string
��C I
.
��I J
Format
��J P
(
��P Q
_fileSizeMessage
��Q a
,
��a b
GetConvertedSize
��c s
(
��s t
size
��t x
)
��x y
)
��y z
;
��z {
Globals
�� #
.
��# $*
_mysqlIdentityBackupFileTime
��$ @
=
��A B
string
��C I
.
��I J
Format
��J P
(
��P Q 
_backupTimeMessage
��Q c
,
��c d
GetTimeInText
��e r
(
��r s
Globals
��s z
.
��z {,
_totalMySQLIdentityBackupTime��{ �
)��� �
)��� �
;��� �
}
�� 
}
�� 
else
�� 
{
�� 
if
�� 
(
�� 
Globals
�� #
.
��# $'
boolMysqlBackupSuccessful
��$ =
&&
��> @
Globals
��A H
.
��H I
_mysqlBackupFile
��I Y
!=
��Z \
null
��] a
&&
�� 
File
�� 
.
��  
Exists
��  &
(
��& '
Globals
��' .
.
��. /
_mysqlBackupFile
��/ ?
)
��? @
)
��@ A
{
�� 
FileInfo
�� $
file
��% )
=
��* +
new
��, /
FileInfo
��0 8
(
��8 9
Globals
��9 @
.
��@ A
_mysqlBackupFile
��A Q
)
��Q R
;
��R S
double
�� "
size
��# '
=
��( )
Math
��* .
.
��. /
Round
��/ 4
(
��4 5
(
��5 6
(
��6 7
double
��7 =
)
��= >
file
��> B
.
��B C
Length
��C I
/
��J K
$num
��L P
/
��Q R
$num
��S W
)
��W X
,
��X Y
$num
��Z [
)
��[ \
;
��\ ]
Globals
�� #
.
��# $"
_mysqlBackupFileSize
��$ 8
=
��9 :
string
��; A
.
��A B
Format
��B H
(
��H I
_fileSizeMessage
��I Y
,
��Y Z
GetConvertedSize
��[ k
(
��k l
size
��l p
)
��p q
)
��q r
;
��r s
Globals
�� #
.
��# $"
_mysqlBackupFileTime
��$ 8
=
��9 :
string
��; A
.
��A B
Format
��B H
(
��H I 
_backupTimeMessage
��I [
,
��[ \
GetTimeInText
��] j
(
��j k
Globals
��k r
.
��r s$
_totalMySQLBackupTime��s �
)��� �
)��� �
;��� �
}
�� 
if
�� 
(
�� 
Globals
�� #
.
��# $/
!boolMysqlIdentityBackupSuccessful
��$ E
&&
��F H
Globals
��I P
.
��P Q&
_mysqlIdentityBackupFile
��Q i
!=
��j l
null
��m q
&&
��r t
File
��u y
.
��y z
Exists��z �
(��� �
Globals��� �
.��� �(
_mysqlIdentityBackupFile��� �
)��� �
)��� �
{
�� 
FileInfo
�� $
file
��% )
=
��* +
new
��, /
FileInfo
��0 8
(
��8 9
Globals
��9 @
.
��@ A&
_mysqlIdentityBackupFile
��A Y
)
��Y Z
;
��Z [
double
�� "
size
��# '
=
��( )
Math
��* .
.
��. /
Round
��/ 4
(
��4 5
(
��5 6
(
��6 7
double
��7 =
)
��= >
file
��> B
.
��B C
Length
��C I
/
��J K
$num
��L P
/
��Q R
$num
��S W
)
��W X
,
��X Y
$num
��Z [
)
��[ \
;
��\ ]
Globals
�� #
.
��# $*
_mysqlIdentityBackupFileSize
��$ @
=
��A B
string
��C I
.
��I J
Format
��J P
(
��P Q
_fileSizeMessage
��Q a
,
��a b
GetConvertedSize
��c s
(
��s t
size
��t x
)
��x y
)
��y z
;
��z {
Globals
�� #
.
��# $*
_mysqlIdentityBackupFileTime
��$ @
=
��A B
string
��C I
.
��I J
Format
��J P
(
��P Q 
_backupTimeMessage
��Q c
,
��c d
GetTimeInText
��e r
(
��r s
Globals
��s z
.
��z {,
_totalMySQLIdentityBackupTime��{ �
)��� �
)��� �
;��� �
}
�� 
}
�� 
if
�� 
(
�� 
Globals
�� 
.
��  '
boolMongoBackupSuccessful
��  9
&&
��: <
Globals
��= D
.
��D E
_backupFolderPath
��E V
!=
��W Y
null
��Z ^
&&
��_ a
	Directory
��b k
.
��k l
Exists
��l r
(
��r s
Globals
��s z
.
��z { 
_backupFolderPath��{ �
)��� �
)��� �
{
�� 
double
�� 
size
�� #
=
��$ %
GetDirectorySize
��& 6
(
��6 7
Globals
��7 >
.
��> ?
_backupFolderPath
��? P
+
��Q R
$str
��S W
+
��X Y
Globals
��Z a
.
��a b"
_mongoDbDatabaseName
��b v
)
��v w
;
��w x
Globals
�� 
.
��  "
_mongoBackupFileSize
��  4
=
��5 6
string
��7 =
.
��= >
Format
��> D
(
��D E
_fileSizeMessage
��E U
,
��U V
GetConvertedSize
��W g
(
��g h
size
��h l
)
��l m
)
��m n
;
��n o
Globals
�� 
.
��  "
_mongoBackupFileTime
��  4
=
��5 6
string
��7 =
.
��= >
Format
��> D
(
��D E 
_backupTimeMessage
��E W
,
��W X
GetTimeInText
��Y f
(
��f g
Globals
��g n
.
��n o&
_totalMongoDBBackupTime��o �
)��� �
)��� �
;��� �
}
�� 
if
�� 
(
�� 
Globals
�� 
.
��  /
!boolElasticSearchBackupSuccessful
��  A
&&
��B D
Globals
��E L
.
��L M 
_elasticBackupFile
��M _
!=
��` b
null
��c g
&&
��h j
	Directory
��k t
.
��t u
Exists
��u {
(
��{ |
Globals��| �
.��� �"
_elasticBackupFile��� �
)��� �
)��� �
{
�� 
double
�� 
size
�� #
=
��$ %
GetDirectorySize
��& 6
(
��6 7
Globals
��7 >
.
��> ? 
_elasticBackupFile
��? Q
)
��Q R
;
��R S
Globals
�� 
.
��  $
_elasticBackupFileSize
��  6
=
��7 8
string
��9 ?
.
��? @
Format
��@ F
(
��F G
_fileSizeMessage
��G W
,
��W X
GetConvertedSize
��Y i
(
��i j
size
��j n
)
��n o
)
��o p
;
��p q
Globals
�� 
.
��  $
_elasticBackupFileTime
��  6
=
��7 8
string
��9 ?
.
��? @
Format
��@ F
(
��F G 
_backupTimeMessage
��G Y
,
��Y Z
GetTimeInText
��[ h
(
��h i
Globals
��i p
.
��p q&
_totalElasticBackupTime��q �
)��� �
)��� �
;��� �
}
�� 
string
�� 

_ipAddress
�� %
=
��& '
GetLocalIPAddress
��( 9
(
��9 :
)
��: ;
;
��; <
string
�� 
_systemName
�� &
=
��' (
Environment
��) 4
.
��4 5
MachineName
��5 @
;
��@ A
string
�� (
_subjectDiskWarningMessage
�� 5
=
��6 7
string
��8 >
.
��> ?
Empty
��? D
;
��D E
_subject
�� 
=
�� 
(
��  

bkupStatus
��  *
==
��+ -
true
��. 2
)
��2 3
?
��4 5
$str
��6 _
:
��` a
$str
��b {
;
��{ |
_body
�� 
=
�� 
string
�� "
.
��" #
Format
��# )
(
��) *
$str
��* k
+
��l m
$str
�� 3
+
��4 5
$str
��6 8
+
��9 :
$str
�� J
+
��K L
$str
��M O
+
��P Q
$str
�� A
+
��B C
$str
��D F
+
��G H
$str
�� K
+
��L M
$str
��N P
+
��Q R
$str
�� R
+
��S T
$str
��U W
+
��X Y
$str
�� @
+
��A B
$str
��C E
+
��F G
$str
�� L
,
��L M
bodyCSSClass
�� $
,
��$ %
bodyMessage
�� #
,
��# $
currentDate
�� #
,
��# $
Globals
�� 
.
��  
_MysqlDBName
��  ,
,
��, -
Globals
�� 
.
��  "
_mysqlBackupFileSize
��  4
,
��4 5
Globals
�� 
.
��  "
_mongoDbDatabaseName
��  4
,
��4 5
Globals
�� 
.
��  "
_mongoBackupFileSize
��  4
,
��4 5
Globals
�� 
.
��  !
_elasticIndicesName
��  3
,
��3 4
Globals
�� 
.
��  $
_elasticBackupFileSize
��  6
,
��6 7
Globals
�� 
.
��  "
_backupSystemDetails
��  4
,
��4 5

_ipAddress
�� "
,
��" #
_systemName
�� #
,
��# $
Globals
�� 
.
��  "
_mysqlBackupFileTime
��  4
,
��4 5
Globals
�� 
.
��  "
_mongoBackupFileTime
��  4
,
��4 5
Globals
�� 
.
��  $
_elasticBackupFileTime
��  6
,
��6 7
Globals
�� 
.
��  "
_MysqlIdentityDBName
��  4
,
��4 5
Globals
�� 
.
��  *
_mysqlIdentityBackupFileSize
��  <
,
��< =
Globals
�� 
.
��  *
_mysqlIdentityBackupFileTime
��  <
)
��< =
;
��= >
if
�� 
(
�� 
Globals
�� 
.
��  &
isTakeBackupUploadFolder
��  8
==
��9 ;
$str
��< ?
)
��? @
{
�� 
_body
�� 
+=
��  
$str
��! L
;
��L M
_body
�� 
=
�� 
string
��  &
.
��& '
Format
��' -
(
��- .
_body
��. 3
,
��3 4
Globals
��5 <
.
��< =#
_folderBackupFileSize
��= R
,
��R S
Globals
��T [
.
��[ \#
_folderBackupFileTime
��\ q
)
��q r
;
��r s
}
�� 
if
�� 
(
�� 
Globals
�� 
.
��  %
boolTakeDatasheetBackup
��  7
)
��7 8
{
�� 
_body
�� 
+=
��  
$str
��! T
;
��T U
_body
�� 
=
�� 
string
��  &
.
��& '
Format
��' -
(
��- .
_body
��. 3
,
��3 4
Globals
��5 <
.
��< =&
_datasheetBackupFileSize
��= U
,
��U V
Globals
��W ^
.
��^ _&
_datasheetBackupFileTime
��_ w
)
��w x
;
��x y
}
�� 
string
�� '
isCopyFolderExternalDrive
�� 4
=
��5 6%
WebConfigurationManager
��7 N
.
��N O
AppSettings
��O Z
[
��Z [
$str
��[ v
]
��v w
.
��w x
ToString��x �
(��� �
)��� �
;��� �
string
�� &
_externalDriveBackupPath
�� 3
=
��4 5%
WebConfigurationManager
��6 M
.
��M N
AppSettings
��N Y
[
��Y Z
$str
��Z s
]
��s t
.
��t u
ToString
��u }
(
��} ~
)
��~ 
;�� �
string
�� $
_networkDriveMapLetter
�� 1
=
��2 3%
WebConfigurationManager
��4 K
.
��K L
AppSettings
��L W
[
��W X
$str
��X o
]
��o p
.
��p q
ToString
��q y
(
��y z
)
��z {
;
��{ |
string
�� "
_deleteOldBackupDays
�� /
=
��0 1%
WebConfigurationManager
��2 I
.
��I J
AppSettings
��J U
[
��U V
$str
��V k
]
��k l
.
��l m
ToString
��m u
(
��u v
)
��v w
;
��w x
if
�� 
(
�� '
isCopyFolderExternalDrive
�� 1
==
��2 4
$str
��5 8
)
��8 9
{
�� 
try
�� 
{
�� 
Console
�� #
.
��# $
	WriteLine
��$ -
(
��- .
$str
��. L
)
��L M
;
��M N
DateTime
�� $&
_externalBackupStartTime
��% =
=
��> ?
DateTime
��@ H
.
��H I
Now
��I L
;
��L M
Globals
�� #
.
��# $%
_uploadFolderBackupFile
��$ ;
=
��< =
Globals
��> E
.
��E F
_backupFolderPath
��F W
;
��W X
var
�� (
_externalDriveBackupFolder
��  :
=
��; <
string
��= C
.
��C D
Format
��D J
(
��J K
$str
��K P
+
��Q R
$str
��S W
+
��X Y
$str
��Z h
+
��i j
$str
��k o
+
��p q
$str��r �
,��� �(
_externalDriveBackupPath��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
)��� �
;��� �
string
�� "(
_isCheckNetworkCredentails
��# =
=
��> ?%
WebConfigurationManager
��@ W
.
��W X
AppSettings
��X c
[
��c d
$str
��d 
]�� �
.��� �
ToString��� �
(��� �
)��� �
;��� �
if
�� 
(
��  (
_isCheckNetworkCredentails
��  :
==
��; =
$str
��> A
)
��A B
{
�� 
string
��  &
_networkUser
��' 3
=
��4 5%
WebConfigurationManager
��6 M
.
��M N
AppSettings
��N Y
[
��Y Z
$str
��Z g
]
��g h
.
��h i
ToString
��i q
(
��q r
)
��r s
;
��s t
string
��  &
_networkPassword
��' 7
=
��8 9%
WebConfigurationManager
��: Q
.
��Q R
AppSettings
��R ]
[
��] ^
$str
��^ o
]
��o p
.
��p q
ToString
��q y
(
��y z
)
��z {
;
��{ |
NetworkCredential
��  1
credentials
��2 =
=
��> ?
new
��@ C
NetworkCredential
��D U
(
��U V
_networkUser
��V b
,
��b c
_networkPassword
��d t
)
��t u
;
��u v
using
��  %
(
��& '
new
��' *#
ConnectToSharedFolder
��+ @
(
��@ A&
_externalDriveBackupPath
��A Y
,
��Y Z
credentials
��[ f
)
��f g
)
��g h
{
��  !
if
��$ &
(
��' (
!
��( )
	Directory
��) 2
.
��2 3
Exists
��3 9
(
��9 :(
_externalDriveBackupFolder
��: T
)
��T U
)
��U V
{
��$ %
	Directory
��( 1
.
��1 2
CreateDirectory
��2 A
(
��A B(
_externalDriveBackupFolder
��B \
)
��\ ]
;
��] ^
}
��$ %
DirectoryCopy
��$ 1
(
��1 2
Globals
��2 9
.
��9 :%
_uploadFolderBackupFile
��: Q
,
��Q R(
_externalDriveBackupFolder
��S m
,
��m n
true
��o s
,
��s t
ref
��u x
Globals��y �
.��� � 
_errorStackTrace��� �
)��� �
;��� �
}
��  !
}
�� 
else
��  
{
�� 
if
��  "
(
��# $
!
��$ %
	Directory
��% .
.
��. /
Exists
��/ 5
(
��5 6(
_externalDriveBackupFolder
��6 P
)
��P Q
)
��Q R
{
��  !
	Directory
��$ -
.
��- .
CreateDirectory
��. =
(
��= >(
_externalDriveBackupFolder
��> X
)
��X Y
;
��Y Z
}
��  !
DirectoryCopy
��  -
(
��- .
Globals
��. 5
.
��5 6%
_uploadFolderBackupFile
��6 M
,
��M N(
_externalDriveBackupFolder
��O i
,
��i j
true
��k o
,
��o p
ref
��q t
Globals
��u |
.
��| }
_errorStackTrace��} �
)��� �
;��� �
}
�� 
DateTime
�� $$
_externalBackupEndTime
��% ;
=
��< =
DateTime
��> F
.
��F G
Now
��G J
;
��J K
Globals
�� #
.
��# $&
_totalExternalBackupTime
��$ <
=
��= >$
_externalBackupEndTime
��? U
.
��U V
Subtract
��V ^
(
��^ _&
_externalBackupStartTime
��_ w
)
��w x
;
��x y
_body
�� !
+=
��" $
$str
��% I
;
��I J
_body
�� !
=
��" #
string
��$ *
.
��* +
Format
��+ 1
(
��1 2
_body
��2 7
,
��7 8
GetTimeInText
��9 F
(
��F G
Globals
��G N
.
��N O&
_totalExternalBackupTime
��O g
)
��g h
)
��h i
;
��i j
Console
�� #
.
��# $
	WriteLine
��$ -
(
��- .
$str
��. N
)
��N O
;
��O P
}
�� 
catch
�� 
(
�� 
	Exception
�� (
ex
��) +
)
��+ ,
{
�� 
Globals
�� #
.
��# $
_errorStackTrace
��$ 4
+=
��5 7
string
��8 >
.
��> ?
Format
��? E
(
��E F
$str
��F ]
,
��] ^
ex
��_ a
.
��a b
Message
��b i
,
��i j
ex
��k m
.
��m n

StackTrace
��n x
)
��x y
;
��y z
}
�� 
}
�� 
if
�� 
(
�� "
_deleteOldBackupDays
�� ,
!=
��- /
null
��0 4
)
��4 5
{
�� 
DateTime
��  '
_deleteOldBackupStartTime
��! :
=
��; <
DateTime
��= E
.
��E F
Now
��F I
;
��I J
Console
�� 
.
��  
	WriteLine
��  )
(
��) *
$str
��* P
)
��P Q
;
��Q R
int
�� !
oldBackupDeleteDays
�� /
=
��0 1
int
��2 5
.
��5 6
Parse
��6 ;
(
��; <"
_deleteOldBackupDays
��< P
)
��P Q
;
��Q R
if
�� 
(
�� 
	Directory
�� %
.
��% &
Exists
��& ,
(
��, -
Globals
��- 4
.
��4 5
_scanDocuFilePath
��5 F
)
��F G
)
��G H
{
�� $
DeleteOldBackupFolders
�� 2
(
��2 3
Globals
��3 :
.
��: ;
_scanDocuFilePath
��; L
,
��L M!
oldBackupDeleteDays
��N a
,
��a b
ref
��c f
Globals
��g n
.
��n o
_errorStackTrace
��o 
)�� �
;��� �
}
�� 
if
�� 
(
�� 
	Directory
�� %
.
��% &
Exists
��& ,
(
��, -&
_externalDriveBackupPath
��- E
)
��E F
)
��F G
{
�� $
DeleteOldBackupFolders
�� 2
(
��2 3&
_externalDriveBackupPath
��3 K
,
��K L!
oldBackupDeleteDays
��M `
,
��` a
ref
��b e
Globals
��f m
.
��m n
_errorStackTrace
��n ~
)
��~ 
;�� �
}
�� 
DateTime
��  %
_deleteOldBackupEndTime
��! 8
=
��9 :
DateTime
��; C
.
��C D
Now
��D G
;
��G H
Globals
�� 
.
��  '
_totalDeleteOldBackupTime
��  9
=
��: ;%
_deleteOldBackupEndTime
��< S
.
��S T
Subtract
��T \
(
��\ ]'
_deleteOldBackupStartTime
��] v
)
��v w
;
��w x
if
�� 
(
�� 
Globals
�� #
.
��# $'
_totalDeleteOldBackupTime
��$ =
.
��= >
TotalSeconds
��> J
>
��K L
$num
��M N
)
��N O
{
�� 
_body
�� !
+=
��" $
$str
��% O
;
��O P
string
�� "
_stringDeleteTime
��# 4
=
��5 6
GetTimeInText
��7 D
(
��D E
Globals
��E L
.
��L M'
_totalDeleteOldBackupTime
��M f
)
��f g
;
��g h
_body
�� !
=
��" #
string
��$ *
.
��* +
Format
��+ 1
(
��1 2
_body
��2 7
,
��7 8
(
��9 :
_stringDeleteTime
��: K
!=
��L N
$str
��O Q
?
��R S
_stringDeleteTime
��T e
:
��f g
$str
��h |
)
��| }
)
��} ~
;
��~ 
}
�� 
Console
�� 
.
��  
	WriteLine
��  )
(
��) *
$str
��* R
)
��R S
;
��S T
}
�� 
	DriveInfo
�� 
[
�� 
]
�� 
	allDrives
��  )
=
��* +
	DriveInfo
��, 5
.
��5 6
	GetDrives
��6 ?
(
��? @
)
��@ A
;
��A B
DirectoryInfo
�� !
	backupDir
��" +
=
��, -
new
��. 1
DirectoryInfo
��2 ?
(
��? @
Globals
��@ G
.
��G H
_scanDocuFilePath
��H Y
)
��Y Z
;
��Z [
DirectoryInfo
�� !
externalDir
��" -
=
��. /
new
��0 3
DirectoryInfo
��4 A
(
��A B$
_networkDriveMapLetter
��B X
)
��X Y
;
��Y Z
double
��  
backupDriveSpaceMB
�� -
=
��. /
$num
��0 1
,
��1 2(
externalBackupDriveSpaceMB
��3 M
=
��N O
$num
��P Q
;
��Q R
foreach
�� 
(
�� 
	DriveInfo
�� &
d
��' (
in
��) +
	allDrives
��, 5
)
��5 6
{
�� 
if
�� 
(
�� 
	backupDir
�� %
.
��% &
Root
��& *
.
��* +
FullName
��+ 3
==
��4 6
d
��7 8
.
��8 9
Name
��9 =
)
��= >
{
��  
backupDriveSpaceMB
�� .
=
��/ 0
(
��1 2
(
��2 3
d
��3 4
.
��4 5 
AvailableFreeSpace
��5 G
/
��H I
$num
��J N
)
��N O
/
��P Q
$num
��R V
)
��V W
;
��W X
Globals
�� #
.
��# $
_backupDriveSpace
��$ 5
=
��6 7
GetConvertedSize
��8 H
(
��H I 
backupDriveSpaceMB
��I [
)
��[ \
;
��\ ]
}
�� 
if
�� 
(
�� 
externalDir
�� '
.
��' (
Root
��( ,
.
��, -
FullName
��- 5
==
��6 8
d
��9 :
.
��: ;
Name
��; ?
)
��? @
{
�� (
externalBackupDriveSpaceMB
�� 6
=
��7 8
(
��9 :
(
��: ;
d
��; <
.
��< = 
AvailableFreeSpace
��= O
/
��P Q
$num
��R V
)
��V W
/
��X Y
$num
��Z ^
)
��^ _
;
��_ `
Globals
�� #
.
��# $'
_externalBackupDriveSpace
��$ =
=
��> ?
GetConvertedSize
��@ P
(
��P Q(
externalBackupDriveSpaceMB
��Q k
)
��k l
;
��l m
}
�� 
}
�� 
if
�� 
(
�� 
Globals
�� 
.
��  
_backupDriveSpace
��  1
!=
��2 4
Globals
��5 <
.
��< =#
_driveNotFoundMessage
��= R
&&
��S U
(
��V W
Globals
��W ^
.
��^ _'
_externalBackupDriveSpace
��_ x
!=
��y {
Globals��| �
.��� �%
_driveNotFoundMessage��� �
||��� �)
isCopyFolderExternalDrive��� �
!=��� �
$str��� �
)��� �
)��� �
{
�� 
double
��  
_backupTotalSizeMB
�� 1
=
��2 3
GetDirectorySize
��4 D
(
��D E
Globals
��E L
.
��L M
_backupFolderPath
��M ^
)
��^ _
;
��_ `
double
�� (
_backupPrecautionarySizeMB
�� 9
=
��: ; 
_backupTotalSizeMB
��< N
*
��O P
$num
��Q R
;
��R S
if
�� 
(
�� (
_backupPrecautionarySizeMB
�� 6
>
��7 8 
backupDriveSpaceMB
��9 K
||
��L N
(
��O P(
_backupPrecautionarySizeMB
��P j
>
��k l)
externalBackupDriveSpaceMB��m �
&&��� �)
isCopyFolderExternalDrive��� �
==��� �
$str��� �
)��� �
)��� �
{
�� (
_subjectDiskWarningMessage
�� 6
=
��7 8
$str
��9 S
;
��S T
}
�� 
else
�� 
if
�� 
(
��  ! 
_backupTotalSizeMB
��! 3
>
��4 5 
backupDriveSpaceMB
��6 H
||
��I K
(
��L M 
_backupTotalSizeMB
��M _
>
��` a(
externalBackupDriveSpaceMB
��b |
&&
��} )
isCopyFolderExternalDrive��� �
==��� �
$str��� �
)��� �
)��� �
{
�� (
_subjectDiskWarningMessage
�� 6
=
��7 8
$str
��9 V
;
��V W
}
�� 
if
�� 
(
�� (
_subjectDiskWarningMessage
�� 6
!=
��7 9
string
��: @
.
��@ A
Empty
��A F
)
��F G
{
�� 
_subject
�� $
+=
��% '(
_subjectDiskWarningMessage
��( B
;
��B C
}
�� 
}
�� 
_body
�� 
+=
�� 
string
�� #
.
��# $
Format
��$ *
(
��* +
$str
��+ n
,
��n o
	backupDir
��p y
.
��y z
Root
��z ~
.
��~ 
FullName�� �
,��� �
Globals��� �
.��� �!
_backupDriveSpace��� �
)��� �
;��� �
if
�� 
(
�� '
isCopyFolderExternalDrive
�� 1
==
��2 4
$str
��5 8
)
��8 9
{
�� 
_body
�� 
+=
��  
string
��! '
.
��' (
Format
��( .
(
��. /
$str
��/ v
,
��v w
externalDir��x �
.��� �
Root��� �
.��� �
FullName��� �
,��� �
Globals��� �
.��� �)
_externalBackupDriveSpace��� �
)��� �
;��� �
}
�� 
DateTime
�� 
_endTime
�� %
=
��& '
DateTime
��( 0
.
��0 1
Now
��1 4
;
��4 5
Globals
�� 
.
�� 
_totalBackupTime
�� ,
=
��- .
_endTime
��/ 7
.
��7 8
Subtract
��8 @
(
��@ A
Globals
��A H
.
��H I
_today
��I O
)
��O P
;
��P Q
string
�� 
_timeSuffix
�� &
=
��' (
GetTimeInText
��) 6
(
��6 7
Globals
��7 >
.
��> ?
_totalBackupTime
��? O
)
��O P
;
��P Q
_body
�� 
+=
�� 
string
�� #
.
��# $
Format
��$ *
(
��* +
$str
��+ g
,
��g h
_timeSuffix
��i t
)
��t u
;
��u v
if
�� 
(
�� 
!
�� 
string
�� 
.
��  
IsNullOrEmpty
��  -
(
��- .
Globals
��. 5
.
��5 6
_errorStackTrace
��6 F
)
��F G
)
��G H
{
�� 
_body
�� 
+=
��  
(
��! "
$str
��" C
+
��D E
Globals
��F M
.
��M N
_errorStackTrace
��N ^
)
��^ _
;
��_ `
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
��  
ex
��! #
)
��# $
{
�� 
Globals
�� 
.
�� 
_errorStackTrace
�� ,
+=
��- /
string
��0 6
.
��6 7
Format
��7 =
(
��= >
$str
��> U
,
��U V
ex
��W Y
.
��Y Z
Message
��Z a
,
��a b
ex
��c e
.
��e f

StackTrace
��f p
)
��p q
;
��q r
}
�� 
try
�� 
{
�� 

EmailModel
�� 

emailModel
�� )
=
��* +
new
��, /

EmailModel
��0 :
(
��: ;
)
��; <
{
�� 
To
�� 
=
�� 
_adminEmailID
�� *
,
��* +
Subject
�� 
=
��  !
string
��" (
.
��( )
Format
��) /
(
��/ 0
_subject
��0 8
,
��8 9
Globals
��: A
.
��A B"
_backupSystemDetails
��B V
)
��V W
,
��W X
Body
�� 
=
�� 
_body
�� $
}
�� 
;
�� 
EmailService
��  
emailService
��! -
=
��. /
new
��0 3
EmailService
��4 @
(
��@ A
)
��A B
;
��B C
emailService
��  
.
��  !
	SendEmail
��! *
(
��* +

emailModel
��+ 5
)
��5 6
;
��6 7
Environment
�� 
.
��  
Exit
��  $
(
��$ %
$num
��% &
)
��& '
;
��' (
}
�� 
catch
�� 
(
�� 
	Exception
��  
ex
��! #
)
��# $
{
�� 
SaveErrorLog
��  
(
��  !
ex
��! #
)
��# $
;
��$ %
}
�� 
}
�� 
}
�� 	
public
�� 
static
�� 
async
�� 
Task
��  )
TakeUploadFolderBackupAsync
��! <
(
��< =
string
��= C
driveLetter
��D O
)
��O P
{
�� 	
try
�� 
{
�� 
if
�� 
(
�� 
Globals
�� 
.
�� &
isTakeBackupUploadFolder
�� 4
==
��5 7
$str
��8 ;
)
��; <
{
�� 
driveLetter
�� 
=
��  !
Path
��" &
.
��& '
GetPathRoot
��' 2
(
��2 3
Globals
��3 :
.
��: ;
_psFilePath
��; F
)
��F G
;
��G H
if
�� 
(
�� 
!
�� 
	Directory
�� "
.
��" #
Exists
��# )
(
��) *
driveLetter
��* 5
)
��5 6
)
��6 7
{
�� 
Globals
�� 
.
��  (
boolFolderBackupSuccessful
��  :
=
��; <
false
��= B
;
��B C
Globals
�� 
.
��  #
_folderBackupFileSize
��  5
=
��6 7
$str
��8 A
+
��B C
Globals
��D K
.
��K L#
_driveNotFoundMessage
��L a
;
��a b
}
�� 
else
�� 
{
�� 
Globals
�� 
.
��  %
_uploadFolderBackupFile
��  7
=
��8 9
string
��: @
.
��@ A
Format
��A G
(
��G H
$str
��H Y
+
��Z [
$str
��\ `
+
��a b
$str
��c w
+
��x y
$str��z �
,��� �
Globals��� �
.��� �!
_scanDocuFilePath��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
)��� �
;��� �
driveLetter
�� #
=
��$ %
Path
��& *
.
��* +
GetPathRoot
��+ 6
(
��6 7
Globals
��7 >
.
��> ?%
_uploadFolderBackupFile
��? V
)
��V W
;
��W X
if
�� 
(
�� 
!
�� 
	Directory
�� &
.
��& '
Exists
��' -
(
��- .
driveLetter
��. 9
)
��9 :
)
��: ;
{
�� 
Globals
�� #
.
��# $(
boolFolderBackupSuccessful
��$ >
=
��? @
false
��A F
;
��F G
Globals
�� #
.
��# $#
_folderBackupFileSize
��$ 9
=
��: ;
$str
��< J
+
��K L
Globals
��M T
.
��T U#
_driveNotFoundMessage
��U j
;
��j k
}
�� 
else
�� 
{
�� 
Console
�� #
.
��# $
	WriteLine
��$ -
(
��- .
$str
��. I
)
��I J
;
��J K
DateTime
�� $$
_uploadBackupStartTime
��% ;
=
��< =
DateTime
��> F
.
��F G
Now
��G J
;
��J K
Globals
�� #
.
��# $(
boolFolderBackupSuccessful
��$ >
=
��? @
BackUpFolderCopy
��A Q
(
��Q R
Globals
��R Y
.
��Y Z
_psFilePath
��Z e
,
��e f
Globals
��g n
.
��n o&
_uploadFolderBackupFile��o �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
ref��� �
Globals��� �
.��� � 
_errorStackTrace��� �
)��� �
;��� �
DateTime
�� $"
_uploadBackupEndTime
��% 9
=
��: ;
DateTime
��< D
.
��D E
Now
��E H
;
��H I
Globals
�� #
.
��# $$
_totalFolderBackupTime
��$ :
=
��; <"
_uploadBackupEndTime
��= Q
.
��Q R
Subtract
��R Z
(
��Z [$
_uploadBackupStartTime
��[ q
)
��q r
;
��r s
Console
�� #
.
��# $
	WriteLine
��$ -
(
��- .
$str
��. K
)
��K L
;
��L M
}
�� 
}
�� 
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
async
�� 
Task
��  ,
TakeDataSheetFolderBackupAsync
��! ?
(
��? @
string
��@ F
driveLetter
��G R
)
��R S
{
�� 	
try
�� 
{
�� 
if
�� 
(
�� 
Globals
�� 
.
�� %
boolTakeDatasheetBackup
�� 3
)
��3 4
{
�� 
driveLetter
�� 
=
��  !
Path
��" &
.
��& '
GetPathRoot
��' 2
(
��2 3
Globals
��3 :
.
��: ; 
_datasheetFilePath
��; M
)
��M N
;
��N O
if
�� 
(
�� 
!
�� 
	Directory
�� "
.
��" #
Exists
��# )
(
��) *
driveLetter
��* 5
)
��5 6
)
��6 7
{
�� 
Globals
�� 
.
��  +
boolDatasheetBackupSuccessful
��  =
=
��> ?
false
��@ E
;
��E F
Globals
�� 
.
��  &
_datasheetBackupFileSize
��  8
=
��9 :
$str
��; D
+
��E F
Globals
��G N
.
��N O#
_driveNotFoundMessage
��O d
;
��d e
}
�� 
else
�� 
{
�� 
Globals
�� 
.
��  (
_datasheetFolderBackupFile
��  :
=
��; <
string
��= C
.
��C D
Format
��D J
(
��J K
$str
��K \
+
��] ^
$str
��_ c
+
��d e
$str
��f z
+
��{ |
$str��} �
,��� �
Globals��� �
.��� �!
_scanDocuFilePath��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
)��� �
;��� �
driveLetter
�� #
=
��$ %
Path
��& *
.
��* +
GetPathRoot
��+ 6
(
��6 7
Globals
��7 >
.
��> ?(
_datasheetFolderBackupFile
��? Y
)
��Y Z
;
��Z [
if
�� 
(
�� 
!
�� 
	Directory
�� &
.
��& '
Exists
��' -
(
��- .
driveLetter
��. 9
)
��9 :
)
��: ;
{
�� 
Globals
�� #
.
��# $+
boolDatasheetBackupSuccessful
��$ A
=
��B C
false
��D I
;
��I J
Globals
�� #
.
��# $&
_datasheetBackupFileSize
��$ <
=
��= >
$str
��? M
+
��N O
Globals
��P W
.
��W X#
_driveNotFoundMessage
��X m
;
��m n
}
�� 
else
�� 
{
�� 
Console
�� #
.
��# $
	WriteLine
��$ -
(
��- .
$str
��. L
)
��L M
;
��M N
DateTime
�� $'
_dataSheetBackupStartTime
��% >
=
��? @
DateTime
��A I
.
��I J
Now
��J M
;
��M N
Globals
�� #
.
��# $+
boolDatasheetBackupSuccessful
��$ A
=
��B C
BackUpFolderCopy
��D T
(
��T U
Globals
��U \
.
��\ ] 
_datasheetFilePath
��] o
,
��o p
Globals
��q x
.
��x y)
_datasheetFolderBackupFile��y �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
ref��� �
Globals��� �
.��� � 
_errorStackTrace��� �
)��� �
;��� �
DateTime
�� $%
_dataSheetBackupEndTime
��% <
=
��= >
DateTime
��? G
.
��G H
Now
��H K
;
��K L
Globals
�� #
.
��# $'
_totalDataSheetBackupTime
��$ =
=
��> ?%
_dataSheetBackupEndTime
��@ W
.
��W X
Subtract
��X `
(
��` a'
_dataSheetBackupStartTime
��a z
)
��z {
;
��{ |
Console
�� #
.
��# $
	WriteLine
��$ -
(
��- .
$str
��. N
)
��N O
;
��O P
}
�� 
}
�� 
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
void
�� *
SetServiceStatusErrorMessage
�� 7
(
��7 8
string
��8 >
pServiceName
��? K
,
��K L
string
��M S
pServiceStatus
��T b
)
��b c
{
�� 	
Globals
�� 
.
�� 
_errorStackTrace
�� $
+=
��% '
string
��( .
.
��. /
Format
��/ 5
(
��5 6
$str
��6 x
,
��x y
pServiceName��z �
,��� �
pServiceStatus��� �
)��� �
;��� �
}
�� 	
public
�� 
static
�� 
async
�� 
Task
��  $
TakeMySQLDBBackupAsync
��! 7
(
��7 8
)
��8 9
{
�� 	
try
�� 
{
�� 
ServiceController
�� !"
scMysqlServiceStatus
��" 6
=
��7 8
new
��9 <
ServiceController
��= N
(
��N O
Globals
��O V
.
��V W
_mySqlServiceName
��W h
)
��h i
;
��i j
if
�� 
(
�� "
scMysqlServiceStatus
�� (
.
��( )
Status
��) /
==
��0 2%
ServiceControllerStatus
��3 J
.
��J K
Running
��K R
)
��R S
{
�� 
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& @
)
��@ A
;
��A B
DateTime
�� #
_mySQLBackupStartTime
�� 2
=
��3 4
DateTime
��5 =
.
��= >
Now
��> A
;
��A B
string
�� #
_mySqlBackupBatchFile
�� 0
=
��1 2%
WebConfigurationManager
��3 J
.
��J K
AppSettings
��K V
[
��V W
$str
��W m
]
��m n
.
��n o
ToString
��o w
(
��w x
)
��x y
;
��y z
string
�� !
_MysqlDbDumpExePath
�� .
=
��/ 0%
WebConfigurationManager
��1 H
.
��H I
AppSettings
��I T
[
��T U
$str
��U i
]
��i j
.
��j k
ToString
��k s
(
��s t
)
��t u
;
��u v
string
�� 
_MysqlUserName
�� )
=
��* +%
WebConfigurationManager
��, C
.
��C D
AppSettings
��D O
[
��O P
$str
��P _
]
��_ `
.
��` a
ToString
��a i
(
��i j
)
��j k
;
��k l
string
�� 
_MysqlPassword
�� )
=
��* +%
WebConfigurationManager
��, C
.
��C D
AppSettings
��D O
[
��O P
$str
��P _
]
��_ `
.
��` a
ToString
��a i
(
��i j
)
��j k
;
��k l
Globals
�� 
.
�� 
_mysqlBackupFile
�� ,
=
��- .
string
��/ 5
.
��5 6
Format
��6 <
(
��< =
$str
��= ~
,
��~ 
Globals��� �
.��� �!
_scanDocuFilePath��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_MysqlDBName��� �
)��� �
;��� �
string
�� 
_str
�� 
=
��  !
string
��" (
.
��( )
Format
��) /
(
��/ 0
$str
��0 4
+
��5 6"
@_MysqlDbDumpExePath
��7 K
+
��L M
$str
��N R
+
��S T
$str
��U [
+
��\ ]
_MysqlUserName
��^ l
+
��m n
$str
��o t
+
��u v
_MysqlPassword��w �
+��� �
$str��� �
+��� �
Globals��� �
.��� �
_MysqlDBName��� �
+��� �
$str��� �
,��� �
Globals��� �
.��� � 
_mysqlBackupFile��� �
)��� �
;��� �
File
�� 
.
�� 
WriteAllText
�� %
(
��% &$
@_mySqlBackupBatchFile
��& <
,
��< =
_str
��> B
)
��B C
;
��C D
ProcessStartInfo
�� $ 
DBProcessStartInfo
��% 7
=
��8 9
new
��: =
ProcessStartInfo
��> N
(
��N O$
@_mySqlBackupBatchFile
��O e
)
��e f
{
�� 
WindowStyle
�� #
=
��$ % 
ProcessWindowStyle
��& 8
.
��8 9
Normal
��9 ?
,
��? @
UseShellExecute
�� '
=
��( )
false
��* /
}
�� 
;
�� 
Process
�� 
	dbProcess
�� %
;
��% &
	dbProcess
�� 
=
�� 
Process
��  '
.
��' (
Start
��( -
(
��- . 
DBProcessStartInfo
��. @
)
��@ A
;
��A B
	dbProcess
�� 
.
�� 
WaitForExit
�� )
(
��) *
)
��* +
;
��+ ,
if
�� 
(
�� 
Globals
�� 
.
��  !
_isCompressedBackup
��  3
==
��4 6
$str
��7 :
)
��: ;
{
�� 
Globals
�� 
.
��  "
_gZipMysqlBackupFile
��  4
=
��5 6
Globals
��7 >
.
��> ?
_mysqlBackupFile
��? O
+
��P Q
Globals
��R Y
.
��Y Z&
_compressedFileExtension
��Z r
;
��r s0
"CompressToZipFileAndDeleteOriginal
�� :
(
��: ;
Globals
��; B
.
��B C
_mysqlBackupFile
��C S
)
��S T
;
��T U
}
�� 
if
�� 
(
�� 
	dbProcess
�� !
.
��! "
ExitCode
��" *
==
��+ -
$num
��. /
)
��/ 0
{
�� 
Globals
�� 
.
��  '
boolMysqlBackupSuccessful
��  9
=
��: ;
true
��< @
;
��@ A
}
�� 
	dbProcess
�� 
.
�� 
Close
�� #
(
��# $
)
��$ %
;
��% &
DateTime
�� !
_mySQLBackupEndTime
�� 0
=
��1 2
DateTime
��3 ;
.
��; <
Now
��< ?
;
��? @
Globals
�� 
.
�� #
_totalMySQLBackupTime
�� 1
=
��2 3!
_mySQLBackupEndTime
��4 G
.
��G H
Subtract
��H P
(
��P Q#
_mySQLBackupStartTime
��Q f
)
��f g
;
��g h
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& B
)
��B C
;
��C D
}
�� 
else
�� 
{
�� *
SetServiceStatusErrorMessage
�� 0
(
��0 1
Globals
��1 8
.
��8 9
_mySqlServiceName
��9 J
,
��J K"
scMysqlServiceStatus
��L `
.
��` a
Status
��a g
.
��g h
ToString
��h p
(
��p q
)
��q r
)
��r s
;
��s t
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
async
�� 
Task
��  ,
TakeMySQLIdentityDBBackupAsync
��! ?
(
��? @
)
��@ A
{
�� 	
try
�� 
{
�� 
ServiceController
�� !"
scMysqlServiceStatus
��" 6
=
��7 8
new
��9 <
ServiceController
��= N
(
��N O
Globals
��O V
.
��V W
_mySqlServiceName
��W h
)
��h i
;
��i j
if
�� 
(
�� "
scMysqlServiceStatus
�� (
.
��( )
Status
��) /
==
��0 2%
ServiceControllerStatus
��3 J
.
��J K
Running
��K R
)
��R S
{
�� 
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& L
)
��L M
;
��M N
DateTime
�� +
_mySQLIdentityBackupStartTime
�� :
=
��; <
DateTime
��= E
.
��E F
Now
��F I
;
��I J
string
�� +
_mysqlIdentityBackupBatchFile
�� 8
=
��9 :%
WebConfigurationManager
��; R
.
��R S
AppSettings
��S ^
[
��^ _
$str
��_ }
]
��} ~
.
��~ 
ToString�� �
(��� �
)��� �
;��� �
string
�� )
_MysqlIdentityDbDumpExePath
�� 6
=
��7 8%
WebConfigurationManager
��9 P
.
��P Q
AppSettings
��Q \
[
��\ ]
$str
��] q
]
��q r
.
��r s
ToString
��s {
(
��{ |
)
��| }
;
��} ~
string
�� $
_MysqlIdentityUserName
�� 1
=
��2 3%
WebConfigurationManager
��4 K
.
��K L
AppSettings
��L W
[
��W X
$str
��X g
]
��g h
.
��h i
ToString
��i q
(
��q r
)
��r s
;
��s t
string
�� $
_MysqlIdentityPassword
�� 1
=
��2 3%
WebConfigurationManager
��4 K
.
��K L
AppSettings
��L W
[
��W X
$str
��X g
]
��g h
.
��h i
ToString
��i q
(
��q r
)
��r s
;
��s t
Globals
�� 
.
�� &
_mysqlIdentityBackupFile
�� 4
=
��5 6
string
��7 =
.
��= >
Format
��> D
(
��D E
$str��E �
,��� �
Globals��� �
.��� �!
_scanDocuFilePath��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �$
_MysqlIdentityDBName��� �
)��� �
;��� �
string
�� 
_strIdentity
�� '
=
��( )
string
��* 0
.
��0 1
Format
��1 7
(
��7 8
$str
��8 <
+
��= >*
@_MysqlIdentityDbDumpExePath
��? [
+
��\ ]
$str
��^ b
+
��c d
$str
��e k
+
��l m%
_MysqlIdentityUserName��n �
+��� �
$str��� �
+��� �&
_MysqlIdentityPassword��� �
+��� �
$str��� �
+��� �
Globals��� �
.��� �$
_MysqlIdentityDBName��� �
+��� �
$str��� �
,��� �
Globals��� �
.��� �(
_mysqlIdentityBackupFile��� �
)��� �
;��� �
File
�� 
.
�� 
WriteAllText
�� %
(
��% &,
@_mysqlIdentityBackupBatchFile
��& D
,
��D E
_strIdentity
��F R
)
��R S
;
��S T
ProcessStartInfo
�� $ 
DBProcessStartInfo
��% 7
=
��8 9
new
��: =
ProcessStartInfo
��> N
(
��N O,
@_mysqlIdentityBackupBatchFile
��O m
)
��m n
{
�� 
WindowStyle
�� #
=
��$ % 
ProcessWindowStyle
��& 8
.
��8 9
Normal
��9 ?
,
��? @
UseShellExecute
�� '
=
��( )
false
��* /
}
�� 
;
�� 
Process
�� 
	dbProcess
�� %
;
��% &
	dbProcess
�� 
=
�� 
Process
��  '
.
��' (
Start
��( -
(
��- . 
DBProcessStartInfo
��. @
)
��@ A
;
��A B
	dbProcess
�� 
.
�� 
WaitForExit
�� )
(
��) *
)
��* +
;
��+ ,
if
�� 
(
�� 
	dbProcess
�� !
.
��! "
ExitCode
��" *
==
��+ -
$num
��. /
)
��/ 0
{
�� 
if
�� 
(
�� 
Globals
�� #
.
��# $!
_isCompressedBackup
��$ 7
==
��8 :
$str
��; >
)
��> ?
{
�� 
Globals
�� #
.
��# $*
_gZipMysqlIdentityBackupFile
��$ @
=
��A B
Globals
��C J
.
��J K&
_mysqlIdentityBackupFile
��K c
+
��d e
Globals
��f m
.
��m n'
_compressedFileExtension��n �
;��� �0
"CompressToZipFileAndDeleteOriginal
�� >
(
��> ?
Globals
��? F
.
��F G&
_mysqlIdentityBackupFile
��G _
)
��_ `
;
��` a
}
�� 
Globals
�� 
.
��  /
!boolMysqlIdentityBackupSuccessful
��  A
=
��B C
true
��D H
;
��H I
}
�� 
	dbProcess
�� 
.
�� 
Close
�� #
(
��# $
)
��$ %
;
��% &
DateTime
�� )
_mySQLIdentityBackupEndTime
�� 8
=
��9 :
DateTime
��; C
.
��C D
Now
��D G
;
��G H
Globals
�� 
.
�� +
_totalMySQLIdentityBackupTime
�� 9
=
��: ;)
_mySQLIdentityBackupEndTime
��< W
.
��W X
Subtract
��X `
(
��` a+
_mySQLIdentityBackupStartTime
��a ~
)
��~ 
;�� �
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& N
)
��N O
;
��O P
}
�� 
else
�� 
{
�� *
SetServiceStatusErrorMessage
�� 0
(
��0 1
Globals
��1 8
.
��8 9
_mySqlServiceName
��9 J
,
��J K"
scMysqlServiceStatus
��L `
.
��` a
Status
��a g
.
��g h
ToString
��h p
(
��p q
)
��q r
)
��r s
;
��s t
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
async
�� 
Task
��  $
TakeMongoDBBackupAsync
��! 7
(
��7 8
)
��8 9
{
�� 	
try
�� 
{
�� 
ServiceController
�� !$
scMongoDBServiceStatus
��" 8
=
��9 :
new
��; >
ServiceController
��? P
(
��P Q
Globals
��Q X
.
��X Y!
_mongoDBServiceName
��Y l
)
��l m
;
��m n
if
�� 
(
�� $
scMongoDBServiceStatus
�� *
.
��* +
Status
��+ 1
==
��2 4%
ServiceControllerStatus
��5 L
.
��L M
Running
��M T
)
��T U
{
�� 
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& C
)
��C D
;
��D E
DateTime
�� %
_mongoDBBackupStartTime
�� 4
=
��5 6
DateTime
��7 ?
.
��? @
Now
��@ C
;
��C D
string
�� !
_mongoDbDumpExePath
�� .
=
��/ 0%
WebConfigurationManager
��1 H
.
��H I
AppSettings
��I T
[
��T U
$str
��U i
]
��i j
.
��j k
ToString
��k s
(
��s t
)
��t u
;
��u v
string
�� 
_mongoDbHostName
�� +
=
��, -%
WebConfigurationManager
��. E
.
��E F
AppSettings
��F Q
[
��Q R
$str
��R c
]
��c d
.
��d e
ToString
��e m
(
��m n
)
��n o
;
��o p
string
�� 
_mongoDbPort
�� '
=
��( )%
WebConfigurationManager
��* A
.
��A B
AppSettings
��B M
[
��M N
$str
��N [
]
��[ \
.
��\ ]
ToString
��] e
(
��e f
)
��f g
;
��g h
string
�� 
_mongoDBUserName
�� +
=
��, -%
WebConfigurationManager
��. E
.
��E F
AppSettings
��F Q
[
��Q R
$str
��R c
]
��c d
.
��d e
ToString
��e m
(
��m n
)
��n o
;
��o p
string
�� 
_mongoDBPassword
�� +
=
��, -%
WebConfigurationManager
��. E
.
��E F
AppSettings
��F Q
[
��Q R
$str
��R c
]
��c d
.
��d e
ToString
��e m
(
��m n
)
��n o
;
��o p
string
�� '
_mongoDbBackupBatFilePath
�� 4
=
��5 6%
WebConfigurationManager
��7 N
.
��N O
AppSettings
��O Z
[
��Z [
$str
��[ q
]
��q r
.
��r s
ToString
��s {
(
��{ |
)
��| }
;
��} ~
string
�� 
shellCmd
�� #
=
��$ %
$str
��& *
+
��+ ,"
@_mongoDbDumpExePath
��- A
+
��B C
$str
��D O
+
��P Q
$str
��R V
+
��W X
$str
��Y c
+
��d e
_mongoDbHostName
��f v
+
��w x
$str��y �
+��� �
_mongoDbPort��� �
+��� �
$str��� �
+��� � 
_mongoDBUserName��� �
+��� �
$str��� �
+��� � 
_mongoDBPassword��� �
+��� �
$str��� �
+��� �
Globals��� �
.��� �$
_mongoDbDatabaseName��� �
+��� �
$str��� �
+��� �
$str��� �
+��� �
$str��� �
+��� �
Globals��� �
.��� �!
_backupFolderPath��� �
+��� �
$str��� �
;��� �
File
�� 
.
�� 
WriteAllText
�� %
(
��% &(
@_mongoDbBackupBatFilePath
��& @
,
��@ A
shellCmd
��B J
)
��J K
;
��K L
ProcessStartInfo
�� $#
_mongoDbBackupProcess
��% :
=
��; <
new
��= @
ProcessStartInfo
��A Q
(
��Q R(
@_mongoDbBackupBatFilePath
��R l
)
��l m
{
�� 
WindowStyle
�� #
=
��$ % 
ProcessWindowStyle
��& 8
.
��8 9
Normal
��9 ?
,
��? @
UseShellExecute
�� '
=
��( )
false
��* /
}
�� 
;
�� 
var
�� 
dbClient
��  
=
��! "
new
��# &
MongoClient
��' 2
(
��2 3
$str
��3 ?
+
��@ A
_mongoDBUserName
��B R
+
��S T
$str
��U X
+
��Y Z
_mongoDBPassword
��[ k
+
��l m
$str
��n q
+
��r s
_mongoDbHostName��t �
+��� �
$str��� �
+��� �
_mongoDbPort��� �
+��� �
$str��� �
)��� �
;��� �
var
�� 
dbList
�� 
=
��  
dbClient
��! )
.
��) *
ListDatabases
��* 7
(
��7 8
)
��8 9
.
��9 :
ToList
��: @
(
��@ A
)
��A B
;
��B C
if
�� 
(
�� 
dbList
�� 
!=
�� !
null
��" &
&&
��' )
dbList
��* 0
.
��0 1
Count
��1 6
>
��7 8
$num
��9 :
)
��: ;
{
�� 
foreach
�� 
(
��  !
var
��! $
item
��% )
in
��* ,
dbList
��- 3
)
��3 4
{
�� 
Console
�� #
.
��# $
	WriteLine
��$ -
(
��- .
item
��. 2
)
��2 3
;
��3 4
if
�� 
(
��  
item
��  $
[
��$ %
$str
��% +
]
��+ ,
.
��, -
AsString
��- 5
==
��6 8
Globals
��9 @
.
��@ A"
_mongoDbDatabaseName
��A U
)
��U V
{
�� 
Process
��  '
mongodbProcess
��( 6
;
��6 7
mongodbProcess
��  .
=
��/ 0
Process
��1 8
.
��8 9
Start
��9 >
(
��> ?#
_mongoDbBackupProcess
��? T
)
��T U
;
��U V
mongodbProcess
��  .
.
��. /
WaitForExit
��/ :
(
��: ;
)
��; <
;
��< =
if
��  "
(
��# $
mongodbProcess
��$ 2
.
��2 3
ExitCode
��3 ;
==
��< >
$num
��? @
)
��@ A
{
��  !
Globals
��$ +
.
��+ ,'
boolMongoBackupSuccessful
��, E
=
��F G
true
��H L
;
��L M
}
��  !
mongodbProcess
��  .
.
��. /
Close
��/ 4
(
��4 5
)
��5 6
;
��6 7
}
�� 
}
�� 
}
�� 
DateTime
�� #
_mongoDBBackupEndTime
�� 2
=
��3 4
DateTime
��5 =
.
��= >
Now
��> A
;
��A B
Globals
�� 
.
�� %
_totalMongoDBBackupTime
�� 3
=
��4 5#
_mongoDBBackupEndTime
��6 K
.
��K L
Subtract
��L T
(
��T U%
_mongoDBBackupStartTime
��U l
)
��l m
;
��m n
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& E
)
��E F
;
��F G
}
�� 
else
�� 
{
�� *
SetServiceStatusErrorMessage
�� 0
(
��0 1
Globals
��1 8
.
��8 9!
_mongoDBServiceName
��9 L
,
��L M$
scMongoDBServiceStatus
��N d
.
��d e
Status
��e k
.
��k l
ToString
��l t
(
��t u
)
��u v
)
��v w
;
��w x
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
async
�� 
Task
��  &
TakeElasticDBBackupAsync
��! 9
(
��9 :
)
��: ;
{
�� 	
try
�� 
{
�� 
ServiceController
�� !*
scElasticSearchServiceStatus
��" >
=
��? @
new
��A D
ServiceController
��E V
(
��V W
Globals
��W ^
.
��^ _'
_elasticsearchServiceName
��_ x
)
��x y
;
��y z
if
�� 
(
�� *
scElasticSearchServiceStatus
�� 0
.
��0 1
Status
��1 7
==
��8 :%
ServiceControllerStatus
��; R
.
��R S
Running
��S Z
)
��Z [
{
�� 
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& E
)
��E F
;
��F G
DateTime
�� %
_elasticBackupStartTime
�� 4
=
��5 6
DateTime
��7 ?
.
��? @
Now
��@ C
;
��C D
string
�� '
elasticCreateBackupAPIUrl
�� 4
=
��5 6%
WebConfigurationManager
��7 N
.
��N O
AppSettings
��O Z
[
��Z [
$str
��[ v
]
��v w
.
��w x
ToString��x �
(��� �
)��� �
;��� �
string
�� 
repositoryName
�� )
=
��* +
string
��, 2
.
��2 3
Format
��3 9
(
��9 :
$str
��: H
,
��H I
Globals
��J Q
.
��Q R
_today
��R X
)
��X Y
;
��Y Z
string
�� 

backupName
�� %
=
��& '
string
��( .
.
��. /
Format
��/ 5
(
��5 6
$str
��6 D
,
��D E
Globals
��F M
.
��M N
_today
��N T
)
��T U
;
��U V
string
�� 
destDirName
�� &
=
��' (
string
��) /
.
��/ 0
Format
��0 6
(
��6 7
$str
��7 q
,
��q r
Globals
��s z
.
��z { 
_scanDocuFilePath��{ �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
,��� �
Globals��� �
.��� �
_today��� �
)��� �
;��� �!
HttpResponseMessage
�� '#
elasticBackupResponse
��( =
=
��> ?
BackupAPICall
��@ M
(
��M N
Globals
��N U
.
��U V
_today
��V \
,
��\ ]
Globals
��^ e
.
��e f!
_elasticIndicesName
��f y
,
��y z
destDirName��{ �
,��� �
ref��� �
Globals��� �
.��� � 
_errorStackTrace��� �
)��� �
;��� �
if
�� 
(
�� #
elasticBackupResponse
�� -
!=
��. 0
null
��1 5
&&
��6 8#
elasticBackupResponse
��9 N
.
��N O

StatusCode
��O Y
==
��Z \
System
��] c
.
��c d
Net
��d g
.
��g h
HttpStatusCode
��h v
.
��v w
OK
��w y
)
��y z
{
�� 
Globals
�� 
.
��  /
!boolElasticSearchBackupSuccessful
��  A
=
��B C
true
��D H
;
��H I
Globals
�� 
.
��   
_elasticBackupFile
��  2
=
��3 4
destDirName
��5 @
;
��@ A
}
�� 
DateTime
�� #
_elasticBackupEndTime
�� 2
=
��3 4
DateTime
��5 =
.
��= >
Now
��> A
;
��A B
Globals
�� 
.
�� %
_totalElasticBackupTime
�� 3
=
��4 5#
_elasticBackupEndTime
��6 K
.
��K L
Subtract
��L T
(
��T U%
_elasticBackupStartTime
��U l
)
��l m
;
��m n
Console
�� 
.
�� 
	WriteLine
�� %
(
��% &
$str
��& G
)
��G H
;
��H I
}
�� 
else
�� 
{
�� *
SetServiceStatusErrorMessage
�� 0
(
��0 1
Globals
��1 8
.
��8 9'
_elasticsearchServiceName
��9 R
,
��R S*
scElasticSearchServiceStatus
��T p
.
��p q
Status
��q w
.
��w x
ToString��x �
(��� �
)��� �
)��� �
;��� �
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
void
�� (
TakeCopyFolderOnDriveAsync
�� 5
(
��5 6
)
��6 7
{
�� 	
}
�� 	
public
�� 
static
�� 
void
�� $
DeleteOldBackupFolders
�� 1
(
��1 2
string
��2 8
pBackupPath
��9 D
,
��D E
int
��F I
pOldBackupDays
��J X
,
��X Y
ref
��Z ]
string
��^ d
_errorStackTrace
��e u
)
��u v
{
�� 	
var
�� 
deleteFilePath
�� 
=
��  
string
��! '
.
��' (
Empty
��( -
;
��- .
try
�� 
{
�� 
if
�� 
(
�� 
	Directory
�� 
.
�� 
Exists
�� $
(
��$ %
pBackupPath
��% 0
)
��0 1
)
��1 2
{
�� 
DirectoryInfo
�� !
dir
��" %
=
��& '
new
��( +
DirectoryInfo
��, 9
(
��9 :
pBackupPath
��: E
)
��E F
;
��F G
var
�� 
dirTemp
�� 
=
��  !
dir
��" %
.
��% &
GetDirectories
��& 4
(
��4 5
)
��5 6
;
��6 7
foreach
�� 
(
�� 
var
��  
dirInfo
��! (
in
��) +
dirTemp
��, 3
)
��3 4
{
�� 
TimeSpan
��  

difference
��! +
=
��, -
DateTime
��. 6
.
��6 7
Now
��7 :
-
��; <
dirInfo
��= D
.
��D E
CreationTime
��E Q
;
��Q R
if
�� 
(
�� 

difference
�� &
.
��& '
Days
��' +
>
��, -
pOldBackupDays
��. <
)
��< =
{
�� 
deleteFilePath
�� *
=
��+ ,
dirInfo
��- 4
.
��4 5
FullName
��5 =
;
��= >
	Directory
�� %
.
��% &
Delete
��& ,
(
��, -
dirInfo
��- 4
.
��4 5
FullName
��5 =
,
��= >
true
��? C
)
��C D
;
��D E
}
�� 
}
�� 
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
_errorStackTrace
��  
+=
��! #
string
��$ *
.
��* +
Format
��+ 1
(
��1 2
$str
��2 Q
,
��Q R
deleteFilePath
��S a
,
��a b
ex
��c e
.
��e f
Message
��f m
,
��m n
ex
��o q
.
��q r

StackTrace
��r |
)
��| }
;
��} ~
}
�� 
}
�� 	
public
�� 
static
�� 
string
�� 
GetConvertedSize
�� -
(
��- .
double
��. 4
sizeInMB
��5 =
)
��= >
{
�� 	
if
�� 
(
�� 
sizeInMB
�� 
>=
�� 
$num
��  
)
��  !
{
�� 
return
�� 
Math
�� 
.
�� 
Round
�� !
(
��! "
(
��" #
sizeInMB
��# +
/
��, -
$num
��. 2
)
��2 3
,
��3 4
$num
��5 6
)
��6 7
+
��8 9
$str
��: ?
;
��? @
}
�� 
else
�� 
{
�� 
return
�� 
Math
�� 
.
�� 
Round
�� !
(
��! "
(
��" #
sizeInMB
��# +
>
��, -
$num
��. /
?
��0 1
sizeInMB
��2 :
:
��; <
$num
��= >
)
��> ?
,
��? @
$num
��A B
)
��B C
+
��D E
$str
��F K
;
��K L
}
�� 
}
�� 	
public
�� 
static
�� 
void
�� 
SaveErrorLog
�� '
(
��' (
	Exception
��( 1
ex
��2 4
)
��4 5
{
�� 	
try
�� 
{
�� 
string
�� 
_ErrorLogFilePath
�� (
=
��) *%
WebConfigurationManager
��+ B
.
��B C
AppSettings
��C N
[
��N O
$str
��O a
]
��a b
.
��b c
ToString
��c k
(
��k l
)
��l m
;
��m n
string
�� 

strLogText
�� !
=
��" #
ex
��$ &
.
��& '
Message
��' .
.
��. /
ToString
��/ 7
(
��7 8
)
��8 9
;
��9 :
if
�� 
(
�� 
ex
�� 
.
�� 

StackTrace
�� !
!=
��" $
null
��% )
)
��) *
{
�� 

strLogText
�� 
=
��  

strLogText
��! +
+
��, -
$str
��. 0
+
��1 2
ex
��3 5
.
��5 6

StackTrace
��6 @
.
��@ A
ToString
��A I
(
��I J
)
��J K
;
��K L
}
�� 
StreamWriter
�� 
log
��  
;
��  !
if
�� 
(
�� 
!
�� 
File
�� 
.
�� 
Exists
��  
(
��  !
_ErrorLogFilePath
��! 2
)
��2 3
)
��3 4
{
�� 
log
�� 
=
�� 
new
�� 
StreamWriter
�� *
(
��* +
_ErrorLogFilePath
��+ <
)
��< =
;
��= >
}
�� 
else
�� 
{
�� 
log
�� 
=
�� 
File
�� 
.
�� 

AppendText
�� )
(
��) *
_ErrorLogFilePath
��* ;
)
��; <
;
��< =
}
�� 
log
�� 
.
�� 
	WriteLine
�� 
(
�� 
DateTime
�� &
.
��& '
Now
��' *
)
��* +
;
��+ ,
log
�� 
.
�� 
	WriteLine
�� 
(
�� 

strLogText
�� (
)
��( )
;
��) *
log
�� 
.
�� 
	WriteLine
�� 
(
�� 
)
�� 
;
��  
log
�� 
.
�� 
Close
�� 
(
�� 
)
�� 
;
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
)
�� 
{
�� 
}
�� 
}
�� 	
private
�� 
static
�� !
HttpResponseMessage
�� *
BackupAPICall
��+ 8
(
��8 9
DateTime
��9 A
_today
��B H
,
��H I
string
��J P 
elasticIndicesName
��Q c
,
��c d
string
��e k
destDirName
��l w
,
��w x
ref
��y |
string��} � 
_errorStackTrace��� �
)��� �
{
�� 	
string
�� '
elasticCreateBackupAPIUrl
�� ,
=
��- .%
WebConfigurationManager
��/ F
.
��F G
AppSettings
��G R
[
��R S
$str
��S n
]
��n o
.
��o p
ToString
��p x
(
��x y
)
��y z
;
��z {
string
�� 
publishMode
�� 
=
��  %
WebConfigurationManager
��! 8
.
��8 9
AppSettings
��9 D
[
��D E
$str
��E R
]
��R S
.
��S T
ToString
��T \
(
��\ ]
)
��] ^
;
��^ _
string
�� 
repositoryName
�� !
=
��" #
publishMode
��$ /
+
��0 1
string
��2 8
.
��8 9
Format
��9 ?
(
��? @
$str
��@ T
,
��T U
_today
��V \
)
��\ ]
;
��] ^
string
�� 

backupName
�� 
=
�� 
publishMode
��  +
+
��, -
string
��. 4
.
��4 5
Format
��5 ;
(
��; <
$str
��< P
,
��P Q
_today
��R X
)
��X Y
;
��Y Z

HttpClient
�� 
client
�� 
=
�� 
new
��  #

HttpClient
��$ .
(
��. /
)
��/ 0
;
��0 1
var
�� 
backupModel
�� 
=
�� 
new
�� !
{
�� 
IndicesName
�� 
=
��  
elasticIndicesName
�� 0
,
��0 1
RepositoryName
�� 
=
��  
repositoryName
��! /
,
��/ 0

BackupName
�� 
=
�� 

backupName
�� '
,
��' (
BackupFolderName
��  
=
��! "

backupName
��# -
}
�� 
;
�� 
var
�� 
dataAsString
�� 
=
�� 
JsonConvert
�� *
.
��* +
SerializeObject
��+ :
(
��: ;
backupModel
��; F
)
��F G
;
��G H
var
�� 
content
�� 
=
�� 
new
�� 
StringContent
�� +
(
��+ ,
dataAsString
��, 8
)
��8 9
;
��9 :
content
�� 
.
�� 
Headers
�� 
.
�� 
ContentType
�� '
=
��( )
new
��* -"
MediaTypeHeaderValue
��. B
(
��B C
$str
��C U
)
��U V
;
��V W
var
�� 
response
�� 
=
�� 
client
�� !
.
��! "
	PostAsync
��" +
(
��+ ,'
elasticCreateBackupAPIUrl
��, E
,
��E F
content
��G N
)
��N O
.
��O P
Result
��P V
;
��V W
if
�� 
(
�� 
response
�� 
!=
�� 
null
��  
)
��  !
{
�� 
Console
�� 
.
�� 
	WriteLine
�� !
(
��! "
$str
��" <
+
��= >
response
��? G
.
��G H
Content
��H O
.
��O P
ReadAsStringAsync
��P a
(
��a b
)
��b c
.
��c d
Result
��d j
)
��j k
;
��k l
}
�� 
var
�� 
elasticBackUpPath
�� !
=
��" #%
WebConfigurationManager
��$ ;
.
��; <
AppSettings
��< G
[
��G H
$str
��H [
]
��[ \
.
��\ ]
ToString
��] e
(
��e f
)
��f g
;
��g h
var
�� 
sourceDirName
�� 
=
�� 
elasticBackUpPath
��  1
+
��2 3

backupName
��4 >
;
��> ?
var
�� (
timeoutForCopyBackupFolder
�� *
=
��+ ,%
WebConfigurationManager
��- D
.
��D E
AppSettings
��E P
[
��P Q
$str
��Q m
]
��m n
.
��n o
ToString
��o w
(
��w x
)
��x y
;
��y z
Thread
�� 
.
�� 
Sleep
�� 
(
�� 
int
�� 
.
�� 
Parse
�� "
(
��" #(
timeoutForCopyBackupFolder
��# =
)
��= >
)
��> ?
;
��? @
DirectoryCopy
�� 
(
�� 
sourceDirName
�� '
,
��' (
destDirName
��) 4
,
��4 5
true
��6 :
,
��: ;
ref
��< ?
_errorStackTrace
��@ P
)
��P Q
;
��Q R
try
�� 
{
�� 
foreach
�� 
(
�� 
string
�� 
folder
��  &
in
��' )
	Directory
��* 3
.
��3 4
GetDirectories
��4 B
(
��B C
sourceDirName
��C P
)
��P Q
)
��Q R
{
�� 
	Directory
�� 
.
�� 
Delete
�� $
(
��$ %
folder
��% +
,
��+ ,
true
��- 1
)
��1 2
;
��2 3
}
�� 
	Directory
�� 
.
�� 
Delete
��  
(
��  !
sourceDirName
��! .
,
��. /
true
��0 4
)
��4 5
;
��5 6
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
;
�� 
return
�� 
response
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
Boolean
�� 
BackUpFolderCopy
�� /
(
��/ 0
string
��0 6
_psFilePath
��7 B
,
��B C
string
��D J%
_uploadFolderBackupFile
��K b
,
��b c
DateTime
��d l
_today
��m s
,
��s t
ref
��u x
string
��y  
_errorStackTrace��� �
)��� �
{
�� 	
try
�� 
{
�� 
DirectoryCopy
�� 
(
�� 
_psFilePath
�� )
,
��) *%
_uploadFolderBackupFile
��+ B
,
��B C
true
��D H
,
��H I
ref
��J M
_errorStackTrace
��N ^
)
��^ _
;
��_ `
return
�� 
true
�� 
;
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
return
�� 
false
�� 
;
�� 
}
�� 
}
�� 	
private
�� 
static
�� 
void
�� 
DirectoryCopy
�� )
(
��) *
string
��* 0
sourceDirName
��1 >
,
��> ?
string
��@ F
destDirName
��G R
,
��R S
bool
��T X
copySubDirs
��Y d
,
��d e
ref
��f i
string
��j p
_errorStackTrace��q �
)��� �
{
�� 	
try
�� 
{
�� 
DirectoryInfo
�� 
dir
�� !
=
��" #
new
��$ '
DirectoryInfo
��( 5
(
��5 6
sourceDirName
��6 C
)
��C D
;
��D E
if
�� 
(
�� 
!
�� 
dir
�� 
.
�� 
Exists
�� 
)
��  
{
�� 
throw
�� 
new
�� (
DirectoryNotFoundException
�� 8
(
��8 9
$str
�� Q
+
�� 
sourceDirName
�� '
)
��' (
;
��( )
}
�� 
DirectoryInfo
�� 
[
�� 
]
�� 
dirs
��  $
=
��% &
dir
��' *
.
��* +
GetDirectories
��+ 9
(
��9 :
)
��: ;
;
��; <
if
�� 
(
�� 
!
�� 
	Directory
�� 
.
�� 
Exists
�� %
(
��% &
destDirName
��& 1
)
��1 2
)
��2 3
{
�� 
	Directory
�� 
.
�� 
CreateDirectory
�� -
(
��- .
destDirName
��. 9
)
��9 :
;
��: ;
}
�� 
FileInfo
�� 
[
�� 
]
�� 
files
��  
=
��! "
dir
��# &
.
��& '
GetFiles
��' /
(
��/ 0
)
��0 1
;
��1 2
foreach
�� 
(
�� 
FileInfo
�� !
file
��" &
in
��' )
files
��* /
)
��/ 0
{
�� 
string
�� 
temppath
�� #
=
��$ %
Path
��& *
.
��* +
Combine
��+ 2
(
��2 3
destDirName
��3 >
,
��> ?
file
��@ D
.
��D E
Name
��E I
)
��I J
;
��J K
file
�� 
.
�� 
CopyTo
�� 
(
��  
temppath
��  (
,
��( )
false
��* /
)
��/ 0
;
��0 1
}
�� 
if
�� 
(
�� 
copySubDirs
�� 
)
��  
{
�� 
foreach
�� 
(
�� 
DirectoryInfo
�� *
subdir
��+ 1
in
��2 4
dirs
��5 9
)
��9 :
{
�� 
string
�� 
temppath
�� '
=
��( )
Path
��* .
.
��. /
Combine
��/ 6
(
��6 7
destDirName
��7 B
,
��B C
subdir
��D J
.
��J K
Name
��K O
)
��O P
;
��P Q
DirectoryCopy
�� %
(
��% &
subdir
��& ,
.
��, -
FullName
��- 5
,
��5 6
temppath
��7 ?
,
��? @
copySubDirs
��A L
,
��L M
ref
��N Q
_errorStackTrace
��R b
)
��b c
;
��c d
}
�� 
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
_errorStackTrace
��  
=
��! "
_errorStackTrace
��# 3
+
��4 5
string
��6 <
.
��< =
Format
��= C
(
��C D
$str
��D [
,
��[ \
ex
��] _
.
��_ `
Message
��` g
,
��g h
ex
��i k
.
��k l

StackTrace
��l v
)
��v w
;
��w x
}
�� 
}
�� 	
private
�� 
static
�� 
string
�� 
GetTimeInText
�� +
(
��+ ,
TimeSpan
��, 4
time
��5 9
)
��9 :
{
�� 	
string
�� 
_timeSuffix
�� 
=
��  
$str
��! #
;
��# $
if
�� 
(
�� 
time
�� 
!=
�� 
null
�� 
)
�� 
{
�� 
_timeSuffix
�� 
+=
�� 
time
�� #
.
��# $
Hours
��$ )
>
��* +
$num
��, -
?
��. /
(
��0 1
time
��1 5
.
��5 6
Hours
��6 ;
.
��; <
ToString
��< D
(
��D E
)
��E F
+
��G H
$str
��I R
)
��R S
:
��T U
$str
��V X
;
��X Y
_timeSuffix
�� 
+=
�� 
time
�� #
.
��# $
Minutes
��$ +
>
��, -
$num
��. /
?
��0 1
(
��2 3
time
��3 7
.
��7 8
Minutes
��8 ?
.
��? @
ToString
��@ H
(
��H I
)
��I J
+
��K L
$str
��M X
)
��X Y
:
��Z [
$str
��\ ^
;
��^ _
_timeSuffix
�� 
+=
�� 
time
�� #
.
��# $
Seconds
��$ +
>
��, -
$num
��. /
?
��0 1
(
��2 3
time
��3 7
.
��7 8
Seconds
��8 ?
.
��? @
ToString
��@ H
(
��H I
)
��I J
+
��K L
$str
��M X
)
��X Y
:
��Z [
$str
��\ ^
;
��^ _
}
�� 
return
�� 
_timeSuffix
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
double
�� 
GetDirectorySize
�� .
(
��. /
string
��/ 5
path
��6 :
)
��: ;
{
�� 	
long
�� 
size
�� 
=
�� 
$num
�� 
;
�� 
var
�� 
dirInfo
�� 
=
�� 
new
�� 
DirectoryInfo
�� +
(
��+ ,
path
��, 0
)
��0 1
;
��1 2
if
�� 
(
�� 
dirInfo
�� 
.
�� 
Exists
�� 
)
�� 
{
�� 
foreach
�� 
(
�� 
FileInfo
�� !
fi
��" $
in
��% '
dirInfo
��( /
.
��/ 0
GetFiles
��0 8
(
��8 9
$str
��9 <
,
��< =
SearchOption
��> J
.
��J K
AllDirectories
��K Y
)
��Y Z
)
��Z [
{
�� 
size
�� 
+=
�� 
fi
�� 
.
�� 
Length
�� %
;
��% &
}
�� 
}
�� 
return
�� 
Math
�� 
.
�� 
Round
�� 
(
�� 
(
�� 
(
��  
double
��  &
)
��& '
size
��' +
/
��, -
$num
��. 2
/
��3 4
$num
��5 9
)
��9 :
,
��: ;
$num
��< =
)
��= >
;
��> ?
}
�� 	
public
�� 
static
�� 
string
�� 
GetLocalIPAddress
�� .
(
��. /
)
��/ 0
{
�� 	
var
�� 
host
�� 
=
�� 
Dns
�� 
.
�� 
GetHostEntry
�� '
(
��' (
Dns
��( +
.
��+ ,
GetHostName
��, 7
(
��7 8
)
��8 9
)
��9 :
;
��: ;
foreach
�� 
(
�� 
var
�� 
ip
�� 
in
�� 
host
�� #
.
��# $
AddressList
��$ /
)
��/ 0
{
�� 
if
�� 
(
�� 
ip
�� 
.
�� 
AddressFamily
�� $
==
��% '
AddressFamily
��( 5
.
��5 6
InterNetwork
��6 B
)
��B C
{
�� 
return
�� 
ip
�� 
.
�� 
ToString
�� &
(
��& '
)
��' (
;
��( )
}
�� 
}
�� 
throw
�� 
new
�� 
	Exception
�� 
(
��  
$str
��  Y
)
��Y Z
;
��Z [
}
�� 	
public
�� 
static
�� 
void
�� 0
"CompressToZipFileAndDeleteOriginal
�� =
(
��= >
string
��> D
pathWithFileName
��E U
)
��U V
{
�� 	
try
�� 
{
�� 
string
�� 
sZipped
�� 
=
��  
pathWithFileName
��! 1
+
��2 3
Globals
��4 ;
.
��; <&
_compressedFileExtension
��< T
;
��T U
ProcessStartInfo
��  
p
��! "
=
��# $
new
��% (
ProcessStartInfo
��) 9
{
�� 
FileName
�� 
=
�� 
Globals
�� &
.
��& '
_7ZipExeFilePath
��' 7
,
��7 8
	Arguments
�� 
=
�� 
$str
��  +
+
��, -
sZipped
��. 5
+
��6 7
$str
��8 ?
+
��@ A
pathWithFileName
��B R
,
��R S
WindowStyle
�� 
=
��  ! 
ProcessWindowStyle
��" 4
.
��4 5
Hidden
��5 ;
}
�� 
;
�� 
Process
�� 
x
�� 
=
�� 
Process
�� #
.
��# $
Start
��$ )
(
��) *
p
��* +
)
��+ ,
;
��, -
x
�� 
.
�� 
WaitForExit
�� 
(
�� 
)
�� 
;
��  
File
�� 
.
�� 
Delete
�� 
(
�� 
pathWithFileName
�� ,
)
��, -
;
��- .
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
}
�� 
}�� �
DD:\Development\FJT\FJT-DEV\FJT.AutoBackup\Properties\AssemblyInfo.cs
[ 
assembly 	
:	 

AssemblyTitle 
( 
$str )
)) *
]* +
[		 
assembly		 	
:			 

AssemblyDescription		 
(		 
$str		 !
)		! "
]		" #
[

 
assembly

 	
:

	 
!
AssemblyConfiguration

  
(

  !
$str

! #
)

# $
]

$ %
[ 
assembly 	
:	 

AssemblyCompany 
( 
$str 
) 
] 
[ 
assembly 	
:	 

AssemblyProduct 
( 
$str +
)+ ,
], -
[ 
assembly 	
:	 

AssemblyCopyright 
( 
$str 0
)0 1
]1 2
[ 
assembly 	
:	 

AssemblyTrademark 
( 
$str 
)  
]  !
[ 
assembly 	
:	 

AssemblyCulture 
( 
$str 
) 
] 
[ 
assembly 	
:	 


ComVisible 
( 
false 
) 
] 
[ 
assembly 	
:	 

Guid 
( 
$str 6
)6 7
]7 8
[## 
assembly## 	
:##	 

AssemblyVersion## 
(## 
$str## $
)##$ %
]##% &
[$$ 
assembly$$ 	
:$$	 

AssemblyFileVersion$$ 
($$ 
$str$$ (
)$$( )
]$$) *