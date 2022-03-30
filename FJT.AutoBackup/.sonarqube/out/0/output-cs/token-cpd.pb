∫
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
} ß
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
})) ê
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
} –5
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
}kk œ≤
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
ToString	,,z Ç
(
,,Ç É
)
,,É Ñ
;
,,Ñ Ö
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
;	.. Ä
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
ToString	//{ É
(
//É Ñ
)
//Ñ Ö
;
//Ö Ü
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
ToString	22{ É
(
22É Ñ
)
22Ñ Ö
;
22Ö Ü
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
ToString	55} Ö
(
55Ö Ü
)
55Ü á
;
55á à
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
_scanDocuFilePath	;;t Ö
,
;;Ö Ü
_today
;;á ç
,
;;ç é
_today
;;è ï
)
;;ï ñ
;
;;ñ ó
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
_datasheetBackupFileSize	<<| î
,
<<î ï*
_mysqlIdentityBackupFileSize
<<ñ ≤
;
<<≤ ≥
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
_datasheetBackupFileTime	==| î
,
==î ï"
_deleteOldBackupTime
==ñ ™
,
==™ ´*
_mysqlIdentityBackupFileTime
==¨ »
;
==» …
public>> 
static>> 
TimeSpan>> "!
_totalMySQLBackupTime>># 8
,>>8 9#
_totalMongoDBBackupTime>>: Q
,>>Q R#
_totalElasticBackupTime>>S j
,>>j k#
_totalFolderBackupTime	>>l Ç
,
>>Ç É'
_totalDataSheetBackupTime
>>Ñ ù
,
>>ù û&
_totalExternalBackupTime
>>ü ∑
,
>>∑ ∏
_totalBackupTime
>>π …
,
>>…  '
_totalDeleteOldBackupTime
>>À ‰
,
>>‰ Â+
_totalMySQLIdentityBackupTime
>>Ê É
;
>>É Ñ
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
_folderBackupFileSize	FFs à
=
FFâ ä
Globals
FFã í
.
FFí ì&
_datasheetBackupFileSize
FFì ´
=
FF¨ ≠
Globals
FFÆ µ
.
FFµ ∂*
_mysqlIdentityBackupFileSize
FF∂ “
=
FF” ‘
$str
FF’ ‰
;
FF‰ Â
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
_folderBackupFileTime	GGs à
=
GGâ ä
Globals
GGã í
.
GGí ì&
_datasheetBackupFileTime
GGì ´
=
GG¨ ≠
Globals
GGÆ µ
.
GGµ ∂"
_deleteOldBackupTime
GG∂  
=
GGÀ Ã
Globals
GGÕ ‘
.
GG‘ ’*
_mysqlIdentityBackupFileTime
GG’ Ò
=
GGÚ Û
$str
GGÙ ˇ
;
GGˇ Ä
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
_totalFolderBackupTime	HHx é
=
HHè ê
Globals
HHë ò
.
HHò ô'
_totalDataSheetBackupTime
HHô ≤
=
HH≥ ¥
Globals
HHµ º
.
HHº Ω&
_totalExternalBackupTime
HHΩ ’
=
HH÷ ◊
Globals
HHÿ ﬂ
.
HHﬂ ‡'
_totalDeleteOldBackupTime
HH‡ ˘
=
HH˙ ˚
Globals
HH¸ É
.
HHÉ Ñ+
_totalMySQLIdentityBackupTime
HHÑ °
=
HH¢ £
TimeSpan
HH§ ¨
.
HH¨ ≠
Zero
HH≠ ±
;
HH± ≤
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
$str	IIl Ñ
;
IIÑ Ö
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
StringSplitOptions	NNu á
.
NNá à 
RemoveEmptyEntries
NNà ö
)
NNö õ
;
NNõ ú
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
elasticDBBackupTask	yyp É
,
yyÉ Ñ'
mySQLIdentityDBBackupTask
yyÖ û
)
yyû ü
;
yyü †
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
ÄÄ 
(
ÄÄ 
var
ÄÄ 
ex
ÄÄ 
in
ÄÄ  "
e
ÄÄ# $
.
ÄÄ$ %
InnerExceptions
ÄÄ% 4
)
ÄÄ4 5
{
ÅÅ 
SaveErrorLog
ÇÇ  
(
ÇÇ  !
ex
ÇÇ! #
)
ÇÇ# $
;
ÇÇ$ %
}
ÉÉ 
}
ÑÑ 
catch
ÖÖ 
(
ÖÖ 
	Exception
ÖÖ 
ex
ÖÖ 
)
ÖÖ  
{
ÜÜ 
Globals
áá 
.
áá 
_errorStackTrace
áá (
+=
áá) +
string
áá, 2
.
áá2 3
Format
áá3 9
(
áá9 :
$str
áá: Q
,
ááQ R
ex
ááS U
.
ááU V
Message
ááV ]
,
áá] ^
ex
áá_ a
.
ááa b

StackTrace
ááb l
)
áál m
;
áám n
Globals
àà 
.
àà 
boolNotAException
àà )
=
àà* +
false
àà, 1
;
àà1 2
SaveErrorLog
ââ 
(
ââ 
ex
ââ 
)
ââ  
;
ââ  !
}
ää 
finally
ãã 
{
åå 
string
çç 
_subject
çç 
=
çç  !
string
çç" (
.
çç( )
Empty
çç) .
;
çç. /
string
éé 
_body
éé 
=
éé 
string
éé %
.
éé% &
Empty
éé& +
;
éé+ ,
try
èè 
{
êê 
bool
ëë 

bkupStatus
ëë #
=
ëë$ %
(
ëë& '
Globals
ëë' .
.
ëë. /
boolNotAException
ëë/ @
&&
ëëA C
Globals
ëëD K
.
ëëK L'
boolMysqlBackupSuccessful
ëëL e
&&
ëëf h
Globals
ëëi p
.
ëëp q(
boolMongoBackupSuccessfulëëq ä
&&ëëã ç
Globalsëëé ï
.ëëï ñ1
!boolElasticSearchBackupSuccessfulëëñ ∑
&&ëë∏ ∫
Globalsëëª ¬
.ëë¬ √1
!boolMysqlIdentityBackupSuccessfulëë√ ‰
)ëë‰ Â
;ëëÂ Ê
if
ìì 
(
ìì 

bkupStatus
ìì "
==
ìì# %
true
ìì& *
&&
ìì+ -
Globals
ìì. 5
.
ìì5 6&
isTakeBackupUploadFolder
ìì6 N
==
ììO Q
$str
ììR U
&&
ììV X
!
ììY Z
Globals
ììZ a
.
ììa b(
boolFolderBackupSuccessful
ììb |
)
ìì| }
{
îî 

bkupStatus
ïï "
=
ïï# $
false
ïï% *
;
ïï* +
}
ññ 
if
óó 
(
óó 

bkupStatus
óó "
==
óó# %
true
óó& *
&&
óó+ -
Globals
óó. 5
.
óó5 6%
boolTakeDatasheetBackup
óó6 M
&&
óóN P
!
óóQ R
Globals
óóR Y
.
óóY Z+
boolDatasheetBackupSuccessful
óóZ w
)
óów x
{
òò 

bkupStatus
ôô "
=
ôô# $
false
ôô% *
;
ôô* +
}
öö 
string
úú 
currentDate
úú &
=
úú' (
DateTime
úú) 1
.
úú1 2
UtcNow
úú2 8
.
úú8 9
ToString
úú9 A
(
úúA B
$str
úúB T
)
úúT U
;
úúU V
string
ùù 
bodyMessage
ùù &
=
ùù' (
(
ùù) *

bkupStatus
ùù* 4
==
ùù5 7
true
ùù8 <
)
ùù< =
?
ùù> ?
$str
ùù@ e
:
ùùf g
$str
ùùh }
;
ùù} ~
string
ûû 
bodyCSSClass
ûû '
=
ûû( )
(
ûû* +

bkupStatus
ûû+ 5
==
ûû6 8
true
ûû9 =
)
ûû= >
?
ûû? @
$str
ûûA J
:
ûûK L
$str
ûûM V
;
ûûV W
string
üü 
_fileSizeMessage
üü +
=
üü, -
$str
üü. E
;
üüE F
string
††  
_backupTimeMessage
†† -
=
††. /
$str
††0 I
;
††I J
if
££ 
(
££ 
Globals
££ 
.
££  &
isTakeBackupUploadFolder
££  8
==
££9 ;
$str
££< ?
)
££? @
{
§§ 
if
•• 
(
•• 
Globals
•• #
.
••# $(
boolFolderBackupSuccessful
••$ >
&&
••? A
Globals
••B I
.
••I J%
_uploadFolderBackupFile
••J a
!=
••b d
null
••e i
&&
••j l
	Directory
••m v
.
••v w
Exists
••w }
(
••} ~
Globals••~ Ö
.••Ö Ü'
_uploadFolderBackupFile••Ü ù
)••ù û
)••û ü
{
¶¶ 
double
ßß "
size
ßß# '
=
ßß( )
GetDirectorySize
ßß* :
(
ßß: ;
Globals
ßß; B
.
ßßB C%
_uploadFolderBackupFile
ßßC Z
)
ßßZ [
;
ßß[ \
Globals
®® #
.
®®# $#
_folderBackupFileSize
®®$ 9
=
®®: ;
string
®®< B
.
®®B C
Format
®®C I
(
®®I J
_fileSizeMessage
®®J Z
,
®®Z [
GetConvertedSize
®®\ l
(
®®l m
size
®®m q
)
®®q r
)
®®r s
;
®®s t
Globals
©© #
.
©©# $#
_folderBackupFileTime
©©$ 9
=
©©: ;
string
©©< B
.
©©B C
Format
©©C I
(
©©I J 
_backupTimeMessage
©©J \
,
©©\ ]
GetTimeInText
©©^ k
(
©©k l
Globals
©©l s
.
©©s t%
_totalFolderBackupTime©©t ä
)©©ä ã
)©©ã å
;©©å ç
}
™™ 
}
¨¨ 
if
≠≠ 
(
≠≠ 
Globals
≠≠ 
.
≠≠  %
boolTakeDatasheetBackup
≠≠  7
)
≠≠7 8
{
ÆÆ 
if
ØØ 
(
ØØ 
Globals
ØØ #
.
ØØ# $+
boolDatasheetBackupSuccessful
ØØ$ A
&&
ØØB D
Globals
ØØE L
.
ØØL M(
_datasheetFolderBackupFile
ØØM g
!=
ØØh j
null
ØØk o
&&
ØØp r
	Directory
ØØs |
.
ØØ| }
ExistsØØ} É
(ØØÉ Ñ
GlobalsØØÑ ã
.ØØã å*
_datasheetFolderBackupFileØØå ¶
)ØØ¶ ß
)ØØß ®
{
∞∞ 
double
±± "
size
±±# '
=
±±( )
GetDirectorySize
±±* :
(
±±: ;
Globals
±±; B
.
±±B C(
_datasheetFolderBackupFile
±±C ]
)
±±] ^
;
±±^ _
Globals
≤≤ #
.
≤≤# $&
_datasheetBackupFileSize
≤≤$ <
=
≤≤= >
string
≤≤? E
.
≤≤E F
Format
≤≤F L
(
≤≤L M
_fileSizeMessage
≤≤M ]
,
≤≤] ^
GetConvertedSize
≤≤_ o
(
≤≤o p
size
≤≤p t
)
≤≤t u
)
≤≤u v
;
≤≤v w
Globals
≥≥ #
.
≥≥# $&
_datasheetBackupFileTime
≥≥$ <
=
≥≥= >
string
≥≥? E
.
≥≥E F
Format
≥≥F L
(
≥≥L M 
_backupTimeMessage
≥≥M _
,
≥≥_ `
GetTimeInText
≥≥a n
(
≥≥n o
Globals
≥≥o v
.
≥≥v w(
_totalDataSheetBackupTime≥≥w ê
)≥≥ê ë
)≥≥ë í
;≥≥í ì
}
¥¥ 
}
µµ 
if
∑∑ 
(
∑∑ 
Globals
∑∑ 
.
∑∑  !
_isCompressedBackup
∑∑  3
==
∑∑4 6
$str
∑∑7 :
)
∑∑: ;
{
∏∏ 
if
ππ 
(
ππ 
Globals
ππ #
.
ππ# $'
boolMysqlBackupSuccessful
ππ$ =
&&
ππ> @
Globals
ππA H
.
ππH I"
_gZipMysqlBackupFile
ππI ]
!=
ππ^ `
null
ππa e
&&
∫∫ 
File
∫∫ 
.
∫∫  
Exists
∫∫  &
(
∫∫& '
Globals
∫∫' .
.
∫∫. /"
_gZipMysqlBackupFile
∫∫/ C
)
∫∫C D
)
∫∫D E
{
ªª 
FileInfo
ºº $
file
ºº% )
=
ºº* +
new
ºº, /
FileInfo
ºº0 8
(
ºº8 9
Globals
ºº9 @
.
ºº@ A"
_gZipMysqlBackupFile
ººA U
)
ººU V
;
ººV W
double
ΩΩ "
size
ΩΩ# '
=
ΩΩ( )
Math
ΩΩ* .
.
ΩΩ. /
Round
ΩΩ/ 4
(
ΩΩ4 5
(
ΩΩ5 6
(
ΩΩ6 7
double
ΩΩ7 =
)
ΩΩ= >
file
ΩΩ> B
.
ΩΩB C
Length
ΩΩC I
/
ΩΩJ K
$num
ΩΩL P
/
ΩΩQ R
$num
ΩΩS W
)
ΩΩW X
,
ΩΩX Y
$num
ΩΩZ [
)
ΩΩ[ \
;
ΩΩ\ ]
Globals
ææ #
.
ææ# $"
_mysqlBackupFileSize
ææ$ 8
=
ææ9 :
string
ææ; A
.
ææA B
Format
ææB H
(
ææH I
_fileSizeMessage
ææI Y
,
ææY Z
GetConvertedSize
ææ[ k
(
ææk l
size
ææl p
)
ææp q
)
ææq r
;
æær s
Globals
øø #
.
øø# $"
_mysqlBackupFileTime
øø$ 8
=
øø9 :
string
øø; A
.
øøA B
Format
øøB H
(
øøH I 
_backupTimeMessage
øøI [
,
øø[ \
GetTimeInText
øø] j
(
øøj k
Globals
øøk r
.
øør s$
_totalMySQLBackupTimeøøs à
)øøà â
)øøâ ä
;øøä ã
}
¡¡ 
if
¬¬ 
(
¬¬ 
Globals
¬¬ #
.
¬¬# $/
!boolMysqlIdentityBackupSuccessful
¬¬$ E
&&
¬¬F H
Globals
¬¬I P
.
¬¬P Q*
_gZipMysqlIdentityBackupFile
¬¬Q m
!=
¬¬n p
null
¬¬q u
&&
¬¬v x
File
¬¬y }
.
¬¬} ~
Exists¬¬~ Ñ
(¬¬Ñ Ö
Globals¬¬Ö å
.¬¬å ç,
_gZipMysqlIdentityBackupFile¬¬ç ©
)¬¬© ™
)¬¬™ ´
{
√√ 
FileInfo
ƒƒ $
file
ƒƒ% )
=
ƒƒ* +
new
ƒƒ, /
FileInfo
ƒƒ0 8
(
ƒƒ8 9
Globals
ƒƒ9 @
.
ƒƒ@ A*
_gZipMysqlIdentityBackupFile
ƒƒA ]
)
ƒƒ] ^
;
ƒƒ^ _
double
≈≈ "
size
≈≈# '
=
≈≈( )
Math
≈≈* .
.
≈≈. /
Round
≈≈/ 4
(
≈≈4 5
(
≈≈5 6
(
≈≈6 7
double
≈≈7 =
)
≈≈= >
file
≈≈> B
.
≈≈B C
Length
≈≈C I
/
≈≈J K
$num
≈≈L P
/
≈≈Q R
$num
≈≈S W
)
≈≈W X
,
≈≈X Y
$num
≈≈Z [
)
≈≈[ \
;
≈≈\ ]
Globals
∆∆ #
.
∆∆# $*
_mysqlIdentityBackupFileSize
∆∆$ @
=
∆∆A B
string
∆∆C I
.
∆∆I J
Format
∆∆J P
(
∆∆P Q
_fileSizeMessage
∆∆Q a
,
∆∆a b
GetConvertedSize
∆∆c s
(
∆∆s t
size
∆∆t x
)
∆∆x y
)
∆∆y z
;
∆∆z {
Globals
«« #
.
««# $*
_mysqlIdentityBackupFileTime
««$ @
=
««A B
string
««C I
.
««I J
Format
««J P
(
««P Q 
_backupTimeMessage
««Q c
,
««c d
GetTimeInText
««e r
(
««r s
Globals
««s z
.
««z {,
_totalMySQLIdentityBackupTime««{ ò
)««ò ô
)««ô ö
;««ö õ
}
»» 
}
…… 
else
   
{
ÀÀ 
if
ÃÃ 
(
ÃÃ 
Globals
ÃÃ #
.
ÃÃ# $'
boolMysqlBackupSuccessful
ÃÃ$ =
&&
ÃÃ> @
Globals
ÃÃA H
.
ÃÃH I
_mysqlBackupFile
ÃÃI Y
!=
ÃÃZ \
null
ÃÃ] a
&&
ÕÕ 
File
ÕÕ 
.
ÕÕ  
Exists
ÕÕ  &
(
ÕÕ& '
Globals
ÕÕ' .
.
ÕÕ. /
_mysqlBackupFile
ÕÕ/ ?
)
ÕÕ? @
)
ÕÕ@ A
{
ŒŒ 
FileInfo
œœ $
file
œœ% )
=
œœ* +
new
œœ, /
FileInfo
œœ0 8
(
œœ8 9
Globals
œœ9 @
.
œœ@ A
_mysqlBackupFile
œœA Q
)
œœQ R
;
œœR S
double
–– "
size
––# '
=
––( )
Math
––* .
.
––. /
Round
––/ 4
(
––4 5
(
––5 6
(
––6 7
double
––7 =
)
––= >
file
––> B
.
––B C
Length
––C I
/
––J K
$num
––L P
/
––Q R
$num
––S W
)
––W X
,
––X Y
$num
––Z [
)
––[ \
;
––\ ]
Globals
—— #
.
——# $"
_mysqlBackupFileSize
——$ 8
=
——9 :
string
——; A
.
——A B
Format
——B H
(
——H I
_fileSizeMessage
——I Y
,
——Y Z
GetConvertedSize
——[ k
(
——k l
size
——l p
)
——p q
)
——q r
;
——r s
Globals
““ #
.
““# $"
_mysqlBackupFileTime
““$ 8
=
““9 :
string
““; A
.
““A B
Format
““B H
(
““H I 
_backupTimeMessage
““I [
,
““[ \
GetTimeInText
““] j
(
““j k
Globals
““k r
.
““r s$
_totalMySQLBackupTime““s à
)““à â
)““â ä
;““ä ã
}
‘‘ 
if
’’ 
(
’’ 
Globals
’’ #
.
’’# $/
!boolMysqlIdentityBackupSuccessful
’’$ E
&&
’’F H
Globals
’’I P
.
’’P Q&
_mysqlIdentityBackupFile
’’Q i
!=
’’j l
null
’’m q
&&
’’r t
File
’’u y
.
’’y z
Exists’’z Ä
(’’Ä Å
Globals’’Å à
.’’à â(
_mysqlIdentityBackupFile’’â °
)’’° ¢
)’’¢ £
{
÷÷ 
FileInfo
◊◊ $
file
◊◊% )
=
◊◊* +
new
◊◊, /
FileInfo
◊◊0 8
(
◊◊8 9
Globals
◊◊9 @
.
◊◊@ A&
_mysqlIdentityBackupFile
◊◊A Y
)
◊◊Y Z
;
◊◊Z [
double
ÿÿ "
size
ÿÿ# '
=
ÿÿ( )
Math
ÿÿ* .
.
ÿÿ. /
Round
ÿÿ/ 4
(
ÿÿ4 5
(
ÿÿ5 6
(
ÿÿ6 7
double
ÿÿ7 =
)
ÿÿ= >
file
ÿÿ> B
.
ÿÿB C
Length
ÿÿC I
/
ÿÿJ K
$num
ÿÿL P
/
ÿÿQ R
$num
ÿÿS W
)
ÿÿW X
,
ÿÿX Y
$num
ÿÿZ [
)
ÿÿ[ \
;
ÿÿ\ ]
Globals
ŸŸ #
.
ŸŸ# $*
_mysqlIdentityBackupFileSize
ŸŸ$ @
=
ŸŸA B
string
ŸŸC I
.
ŸŸI J
Format
ŸŸJ P
(
ŸŸP Q
_fileSizeMessage
ŸŸQ a
,
ŸŸa b
GetConvertedSize
ŸŸc s
(
ŸŸs t
size
ŸŸt x
)
ŸŸx y
)
ŸŸy z
;
ŸŸz {
Globals
⁄⁄ #
.
⁄⁄# $*
_mysqlIdentityBackupFileTime
⁄⁄$ @
=
⁄⁄A B
string
⁄⁄C I
.
⁄⁄I J
Format
⁄⁄J P
(
⁄⁄P Q 
_backupTimeMessage
⁄⁄Q c
,
⁄⁄c d
GetTimeInText
⁄⁄e r
(
⁄⁄r s
Globals
⁄⁄s z
.
⁄⁄z {,
_totalMySQLIdentityBackupTime⁄⁄{ ò
)⁄⁄ò ô
)⁄⁄ô ö
;⁄⁄ö õ
}
€€ 
}
‹‹ 
if
ﬁﬁ 
(
ﬁﬁ 
Globals
ﬁﬁ 
.
ﬁﬁ  '
boolMongoBackupSuccessful
ﬁﬁ  9
&&
ﬁﬁ: <
Globals
ﬁﬁ= D
.
ﬁﬁD E
_backupFolderPath
ﬁﬁE V
!=
ﬁﬁW Y
null
ﬁﬁZ ^
&&
ﬁﬁ_ a
	Directory
ﬁﬁb k
.
ﬁﬁk l
Exists
ﬁﬁl r
(
ﬁﬁr s
Globals
ﬁﬁs z
.
ﬁﬁz { 
_backupFolderPathﬁﬁ{ å
)ﬁﬁå ç
)ﬁﬁç é
{
ﬂﬂ 
double
‡‡ 
size
‡‡ #
=
‡‡$ %
GetDirectorySize
‡‡& 6
(
‡‡6 7
Globals
‡‡7 >
.
‡‡> ?
_backupFolderPath
‡‡? P
+
‡‡Q R
$str
‡‡S W
+
‡‡X Y
Globals
‡‡Z a
.
‡‡a b"
_mongoDbDatabaseName
‡‡b v
)
‡‡v w
;
‡‡w x
Globals
·· 
.
··  "
_mongoBackupFileSize
··  4
=
··5 6
string
··7 =
.
··= >
Format
··> D
(
··D E
_fileSizeMessage
··E U
,
··U V
GetConvertedSize
··W g
(
··g h
size
··h l
)
··l m
)
··m n
;
··n o
Globals
‚‚ 
.
‚‚  "
_mongoBackupFileTime
‚‚  4
=
‚‚5 6
string
‚‚7 =
.
‚‚= >
Format
‚‚> D
(
‚‚D E 
_backupTimeMessage
‚‚E W
,
‚‚W X
GetTimeInText
‚‚Y f
(
‚‚f g
Globals
‚‚g n
.
‚‚n o&
_totalMongoDBBackupTime‚‚o Ü
)‚‚Ü á
)‚‚á à
;‚‚à â
}
„„ 
if
‰‰ 
(
‰‰ 
Globals
‰‰ 
.
‰‰  /
!boolElasticSearchBackupSuccessful
‰‰  A
&&
‰‰B D
Globals
‰‰E L
.
‰‰L M 
_elasticBackupFile
‰‰M _
!=
‰‰` b
null
‰‰c g
&&
‰‰h j
	Directory
‰‰k t
.
‰‰t u
Exists
‰‰u {
(
‰‰{ |
Globals‰‰| É
.‰‰É Ñ"
_elasticBackupFile‰‰Ñ ñ
)‰‰ñ ó
)‰‰ó ò
{
ÂÂ 
double
ÊÊ 
size
ÊÊ #
=
ÊÊ$ %
GetDirectorySize
ÊÊ& 6
(
ÊÊ6 7
Globals
ÊÊ7 >
.
ÊÊ> ? 
_elasticBackupFile
ÊÊ? Q
)
ÊÊQ R
;
ÊÊR S
Globals
ÁÁ 
.
ÁÁ  $
_elasticBackupFileSize
ÁÁ  6
=
ÁÁ7 8
string
ÁÁ9 ?
.
ÁÁ? @
Format
ÁÁ@ F
(
ÁÁF G
_fileSizeMessage
ÁÁG W
,
ÁÁW X
GetConvertedSize
ÁÁY i
(
ÁÁi j
size
ÁÁj n
)
ÁÁn o
)
ÁÁo p
;
ÁÁp q
Globals
ËË 
.
ËË  $
_elasticBackupFileTime
ËË  6
=
ËË7 8
string
ËË9 ?
.
ËË? @
Format
ËË@ F
(
ËËF G 
_backupTimeMessage
ËËG Y
,
ËËY Z
GetTimeInText
ËË[ h
(
ËËh i
Globals
ËËi p
.
ËËp q&
_totalElasticBackupTimeËËq à
)ËËà â
)ËËâ ä
;ËËä ã
}
ÈÈ 
string
ÎÎ 

_ipAddress
ÎÎ %
=
ÎÎ& '
GetLocalIPAddress
ÎÎ( 9
(
ÎÎ9 :
)
ÎÎ: ;
;
ÎÎ; <
string
ÏÏ 
_systemName
ÏÏ &
=
ÏÏ' (
Environment
ÏÏ) 4
.
ÏÏ4 5
MachineName
ÏÏ5 @
;
ÏÏ@ A
string
ÌÌ (
_subjectDiskWarningMessage
ÌÌ 5
=
ÌÌ6 7
string
ÌÌ8 >
.
ÌÌ> ?
Empty
ÌÌ? D
;
ÌÌD E
_subject
ÓÓ 
=
ÓÓ 
(
ÓÓ  

bkupStatus
ÓÓ  *
==
ÓÓ+ -
true
ÓÓ. 2
)
ÓÓ2 3
?
ÓÓ4 5
$str
ÓÓ6 _
:
ÓÓ` a
$str
ÓÓb {
;
ÓÓ{ |
_body
ÔÔ 
=
ÔÔ 
string
ÔÔ "
.
ÔÔ" #
Format
ÔÔ# )
(
ÔÔ) *
$str
ÔÔ* k
+
ÔÔl m
$str
 3
+
4 5
$str
6 8
+
9 :
$str
ÒÒ J
+
ÒÒK L
$str
ÒÒM O
+
ÒÒP Q
$str
ÚÚ A
+
ÚÚB C
$str
ÚÚD F
+
ÚÚG H
$str
ÛÛ K
+
ÛÛL M
$str
ÛÛN P
+
ÛÛQ R
$str
ÙÙ R
+
ÙÙS T
$str
ÙÙU W
+
ÙÙX Y
$str
ıı @
+
ııA B
$str
ııC E
+
ııF G
$str
ˆˆ L
,
ˆˆL M
bodyCSSClass
˜˜ $
,
˜˜$ %
bodyMessage
¯¯ #
,
¯¯# $
currentDate
˘˘ #
,
˘˘# $
Globals
˙˙ 
.
˙˙  
_MysqlDBName
˙˙  ,
,
˙˙, -
Globals
˚˚ 
.
˚˚  "
_mysqlBackupFileSize
˚˚  4
,
˚˚4 5
Globals
¸¸ 
.
¸¸  "
_mongoDbDatabaseName
¸¸  4
,
¸¸4 5
Globals
˝˝ 
.
˝˝  "
_mongoBackupFileSize
˝˝  4
,
˝˝4 5
Globals
˛˛ 
.
˛˛  !
_elasticIndicesName
˛˛  3
,
˛˛3 4
Globals
ˇˇ 
.
ˇˇ  $
_elasticBackupFileSize
ˇˇ  6
,
ˇˇ6 7
Globals
ÄÄ 
.
ÄÄ  "
_backupSystemDetails
ÄÄ  4
,
ÄÄ4 5

_ipAddress
ÅÅ "
,
ÅÅ" #
_systemName
ÇÇ #
,
ÇÇ# $
Globals
ÉÉ 
.
ÉÉ  "
_mysqlBackupFileTime
ÉÉ  4
,
ÉÉ4 5
Globals
ÑÑ 
.
ÑÑ  "
_mongoBackupFileTime
ÑÑ  4
,
ÑÑ4 5
Globals
ÖÖ 
.
ÖÖ  $
_elasticBackupFileTime
ÖÖ  6
,
ÖÖ6 7
Globals
ÜÜ 
.
ÜÜ  "
_MysqlIdentityDBName
ÜÜ  4
,
ÜÜ4 5
Globals
áá 
.
áá  *
_mysqlIdentityBackupFileSize
áá  <
,
áá< =
Globals
àà 
.
àà  *
_mysqlIdentityBackupFileTime
àà  <
)
àà< =
;
àà= >
if
ää 
(
ää 
Globals
ää 
.
ää  &
isTakeBackupUploadFolder
ää  8
==
ää9 ;
$str
ää< ?
)
ää? @
{
ãã 
_body
åå 
+=
åå  
$str
åå! L
;
ååL M
_body
çç 
=
çç 
string
çç  &
.
çç& '
Format
çç' -
(
çç- .
_body
çç. 3
,
çç3 4
Globals
çç5 <
.
çç< =#
_folderBackupFileSize
çç= R
,
ççR S
Globals
ççT [
.
çç[ \#
_folderBackupFileTime
çç\ q
)
ççq r
;
ççr s
}
èè 
if
êê 
(
êê 
Globals
êê 
.
êê  %
boolTakeDatasheetBackup
êê  7
)
êê7 8
{
ëë 
_body
íí 
+=
íí  
$str
íí! T
;
ííT U
_body
ìì 
=
ìì 
string
ìì  &
.
ìì& '
Format
ìì' -
(
ìì- .
_body
ìì. 3
,
ìì3 4
Globals
ìì5 <
.
ìì< =&
_datasheetBackupFileSize
ìì= U
,
ììU V
Globals
ììW ^
.
ìì^ _&
_datasheetBackupFileTime
ìì_ w
)
ììw x
;
ììx y
}
îî 
string
ññ '
isCopyFolderExternalDrive
ññ 4
=
ññ5 6%
WebConfigurationManager
ññ7 N
.
ññN O
AppSettings
ññO Z
[
ññZ [
$str
ññ[ v
]
ññv w
.
ññw x
ToStringññx Ä
(ññÄ Å
)ññÅ Ç
;ññÇ É
string
óó &
_externalDriveBackupPath
óó 3
=
óó4 5%
WebConfigurationManager
óó6 M
.
óóM N
AppSettings
óóN Y
[
óóY Z
$str
óóZ s
]
óós t
.
óót u
ToString
óóu }
(
óó} ~
)
óó~ 
;óó Ä
string
òò $
_networkDriveMapLetter
òò 1
=
òò2 3%
WebConfigurationManager
òò4 K
.
òòK L
AppSettings
òòL W
[
òòW X
$str
òòX o
]
òòo p
.
òòp q
ToString
òòq y
(
òòy z
)
òòz {
;
òò{ |
string
ôô "
_deleteOldBackupDays
ôô /
=
ôô0 1%
WebConfigurationManager
ôô2 I
.
ôôI J
AppSettings
ôôJ U
[
ôôU V
$str
ôôV k
]
ôôk l
.
ôôl m
ToString
ôôm u
(
ôôu v
)
ôôv w
;
ôôw x
if
õõ 
(
õõ '
isCopyFolderExternalDrive
õõ 1
==
õõ2 4
$str
õõ5 8
)
õõ8 9
{
úú 
try
ùù 
{
ûû 
Console
üü #
.
üü# $
	WriteLine
üü$ -
(
üü- .
$str
üü. L
)
üüL M
;
üüM N
DateTime
†† $&
_externalBackupStartTime
††% =
=
††> ?
DateTime
††@ H
.
††H I
Now
††I L
;
††L M
Globals
°° #
.
°°# $%
_uploadFolderBackupFile
°°$ ;
=
°°< =
Globals
°°> E
.
°°E F
_backupFolderPath
°°F W
;
°°W X
var
¢¢ (
_externalDriveBackupFolder
¢¢  :
=
¢¢; <
string
¢¢= C
.
¢¢C D
Format
¢¢D J
(
¢¢J K
$str
¢¢K P
+
¢¢Q R
$str
¢¢S W
+
¢¢X Y
$str
¢¢Z h
+
¢¢i j
$str
¢¢k o
+
¢¢p q
$str¢¢r Ü
,¢¢Ü á(
_externalDriveBackupPath¢¢à †
,¢¢† °
Globals¢¢¢ ©
.¢¢© ™
_today¢¢™ ∞
,¢¢∞ ±
Globals¢¢≤ π
.¢¢π ∫
_today¢¢∫ ¿
)¢¢¿ ¡
;¢¢¡ ¬
string
££ "(
_isCheckNetworkCredentails
££# =
=
££> ?%
WebConfigurationManager
££@ W
.
££W X
AppSettings
££X c
[
££c d
$str
££d 
]££ Ä
.££Ä Å
ToString££Å â
(££â ä
)££ä ã
;££ã å
if
§§ 
(
§§  (
_isCheckNetworkCredentails
§§  :
==
§§; =
$str
§§> A
)
§§A B
{
•• 
string
¶¶  &
_networkUser
¶¶' 3
=
¶¶4 5%
WebConfigurationManager
¶¶6 M
.
¶¶M N
AppSettings
¶¶N Y
[
¶¶Y Z
$str
¶¶Z g
]
¶¶g h
.
¶¶h i
ToString
¶¶i q
(
¶¶q r
)
¶¶r s
;
¶¶s t
string
ßß  &
_networkPassword
ßß' 7
=
ßß8 9%
WebConfigurationManager
ßß: Q
.
ßßQ R
AppSettings
ßßR ]
[
ßß] ^
$str
ßß^ o
]
ßßo p
.
ßßp q
ToString
ßßq y
(
ßßy z
)
ßßz {
;
ßß{ |
NetworkCredential
®®  1
credentials
®®2 =
=
®®> ?
new
®®@ C
NetworkCredential
®®D U
(
®®U V
_networkUser
®®V b
,
®®b c
_networkPassword
®®d t
)
®®t u
;
®®u v
using
™™  %
(
™™& '
new
™™' *#
ConnectToSharedFolder
™™+ @
(
™™@ A&
_externalDriveBackupPath
™™A Y
,
™™Y Z
credentials
™™[ f
)
™™f g
)
™™g h
{
´´  !
if
≠≠$ &
(
≠≠' (
!
≠≠( )
	Directory
≠≠) 2
.
≠≠2 3
Exists
≠≠3 9
(
≠≠9 :(
_externalDriveBackupFolder
≠≠: T
)
≠≠T U
)
≠≠U V
{
ÆÆ$ %
	Directory
ØØ( 1
.
ØØ1 2
CreateDirectory
ØØ2 A
(
ØØA B(
_externalDriveBackupFolder
ØØB \
)
ØØ\ ]
;
ØØ] ^
}
∞∞$ %
DirectoryCopy
±±$ 1
(
±±1 2
Globals
±±2 9
.
±±9 :%
_uploadFolderBackupFile
±±: Q
,
±±Q R(
_externalDriveBackupFolder
±±S m
,
±±m n
true
±±o s
,
±±s t
ref
±±u x
Globals±±y Ä
.±±Ä Å 
_errorStackTrace±±Å ë
)±±ë í
;±±í ì
}
≤≤  !
}
≥≥ 
else
¥¥  
{
µµ 
if
∑∑  "
(
∑∑# $
!
∑∑$ %
	Directory
∑∑% .
.
∑∑. /
Exists
∑∑/ 5
(
∑∑5 6(
_externalDriveBackupFolder
∑∑6 P
)
∑∑P Q
)
∑∑Q R
{
∏∏  !
	Directory
ππ$ -
.
ππ- .
CreateDirectory
ππ. =
(
ππ= >(
_externalDriveBackupFolder
ππ> X
)
ππX Y
;
ππY Z
}
∫∫  !
DirectoryCopy
ªª  -
(
ªª- .
Globals
ªª. 5
.
ªª5 6%
_uploadFolderBackupFile
ªª6 M
,
ªªM N(
_externalDriveBackupFolder
ªªO i
,
ªªi j
true
ªªk o
,
ªªo p
ref
ªªq t
Globals
ªªu |
.
ªª| }
_errorStackTraceªª} ç
)ªªç é
;ªªé è
}
ºº 
DateTime
ΩΩ $$
_externalBackupEndTime
ΩΩ% ;
=
ΩΩ< =
DateTime
ΩΩ> F
.
ΩΩF G
Now
ΩΩG J
;
ΩΩJ K
Globals
ææ #
.
ææ# $&
_totalExternalBackupTime
ææ$ <
=
ææ= >$
_externalBackupEndTime
ææ? U
.
ææU V
Subtract
ææV ^
(
ææ^ _&
_externalBackupStartTime
ææ_ w
)
ææw x
;
ææx y
_body
¿¿ !
+=
¿¿" $
$str
¿¿% I
;
¿¿I J
_body
¡¡ !
=
¡¡" #
string
¡¡$ *
.
¡¡* +
Format
¡¡+ 1
(
¡¡1 2
_body
¡¡2 7
,
¡¡7 8
GetTimeInText
¡¡9 F
(
¡¡F G
Globals
¡¡G N
.
¡¡N O&
_totalExternalBackupTime
¡¡O g
)
¡¡g h
)
¡¡h i
;
¡¡i j
Console
¬¬ #
.
¬¬# $
	WriteLine
¬¬$ -
(
¬¬- .
$str
¬¬. N
)
¬¬N O
;
¬¬O P
}
√√ 
catch
ƒƒ 
(
ƒƒ 
	Exception
ƒƒ (
ex
ƒƒ) +
)
ƒƒ+ ,
{
≈≈ 
Globals
∆∆ #
.
∆∆# $
_errorStackTrace
∆∆$ 4
+=
∆∆5 7
string
∆∆8 >
.
∆∆> ?
Format
∆∆? E
(
∆∆E F
$str
∆∆F ]
,
∆∆] ^
ex
∆∆_ a
.
∆∆a b
Message
∆∆b i
,
∆∆i j
ex
∆∆k m
.
∆∆m n

StackTrace
∆∆n x
)
∆∆x y
;
∆∆y z
}
«« 
}
»» 
if
ÃÃ 
(
ÃÃ "
_deleteOldBackupDays
ÃÃ ,
!=
ÃÃ- /
null
ÃÃ0 4
)
ÃÃ4 5
{
ÕÕ 
DateTime
ŒŒ  '
_deleteOldBackupStartTime
ŒŒ! :
=
ŒŒ; <
DateTime
ŒŒ= E
.
ŒŒE F
Now
ŒŒF I
;
ŒŒI J
Console
œœ 
.
œœ  
	WriteLine
œœ  )
(
œœ) *
$str
œœ* P
)
œœP Q
;
œœQ R
int
–– !
oldBackupDeleteDays
–– /
=
––0 1
int
––2 5
.
––5 6
Parse
––6 ;
(
––; <"
_deleteOldBackupDays
––< P
)
––P Q
;
––Q R
if
—— 
(
—— 
	Directory
—— %
.
——% &
Exists
——& ,
(
——, -
Globals
——- 4
.
——4 5
_scanDocuFilePath
——5 F
)
——F G
)
——G H
{
““ $
DeleteOldBackupFolders
”” 2
(
””2 3
Globals
””3 :
.
””: ;
_scanDocuFilePath
””; L
,
””L M!
oldBackupDeleteDays
””N a
,
””a b
ref
””c f
Globals
””g n
.
””n o
_errorStackTrace
””o 
)”” Ä
;””Ä Å
}
‘‘ 
if
’’ 
(
’’ 
	Directory
’’ %
.
’’% &
Exists
’’& ,
(
’’, -&
_externalDriveBackupPath
’’- E
)
’’E F
)
’’F G
{
÷÷ $
DeleteOldBackupFolders
◊◊ 2
(
◊◊2 3&
_externalDriveBackupPath
◊◊3 K
,
◊◊K L!
oldBackupDeleteDays
◊◊M `
,
◊◊` a
ref
◊◊b e
Globals
◊◊f m
.
◊◊m n
_errorStackTrace
◊◊n ~
)
◊◊~ 
;◊◊ Ä
}
ÿÿ 
DateTime
ŸŸ  %
_deleteOldBackupEndTime
ŸŸ! 8
=
ŸŸ9 :
DateTime
ŸŸ; C
.
ŸŸC D
Now
ŸŸD G
;
ŸŸG H
Globals
⁄⁄ 
.
⁄⁄  '
_totalDeleteOldBackupTime
⁄⁄  9
=
⁄⁄: ;%
_deleteOldBackupEndTime
⁄⁄< S
.
⁄⁄S T
Subtract
⁄⁄T \
(
⁄⁄\ ]'
_deleteOldBackupStartTime
⁄⁄] v
)
⁄⁄v w
;
⁄⁄w x
if
€€ 
(
€€ 
Globals
€€ #
.
€€# $'
_totalDeleteOldBackupTime
€€$ =
.
€€= >
TotalSeconds
€€> J
>
€€K L
$num
€€M N
)
€€N O
{
‹‹ 
_body
›› !
+=
››" $
$str
››% O
;
››O P
string
ﬁﬁ "
_stringDeleteTime
ﬁﬁ# 4
=
ﬁﬁ5 6
GetTimeInText
ﬁﬁ7 D
(
ﬁﬁD E
Globals
ﬁﬁE L
.
ﬁﬁL M'
_totalDeleteOldBackupTime
ﬁﬁM f
)
ﬁﬁf g
;
ﬁﬁg h
_body
ﬂﬂ !
=
ﬂﬂ" #
string
ﬂﬂ$ *
.
ﬂﬂ* +
Format
ﬂﬂ+ 1
(
ﬂﬂ1 2
_body
ﬂﬂ2 7
,
ﬂﬂ7 8
(
ﬂﬂ9 :
_stringDeleteTime
ﬂﬂ: K
!=
ﬂﬂL N
$str
ﬂﬂO Q
?
ﬂﬂR S
_stringDeleteTime
ﬂﬂT e
:
ﬂﬂf g
$str
ﬂﬂh |
)
ﬂﬂ| }
)
ﬂﬂ} ~
;
ﬂﬂ~ 
}
‡‡ 
Console
·· 
.
··  
	WriteLine
··  )
(
··) *
$str
··* R
)
··R S
;
··S T
}
‚‚ 
	DriveInfo
ÂÂ 
[
ÂÂ 
]
ÂÂ 
	allDrives
ÂÂ  )
=
ÂÂ* +
	DriveInfo
ÂÂ, 5
.
ÂÂ5 6
	GetDrives
ÂÂ6 ?
(
ÂÂ? @
)
ÂÂ@ A
;
ÂÂA B
DirectoryInfo
ÊÊ !
	backupDir
ÊÊ" +
=
ÊÊ, -
new
ÊÊ. 1
DirectoryInfo
ÊÊ2 ?
(
ÊÊ? @
Globals
ÊÊ@ G
.
ÊÊG H
_scanDocuFilePath
ÊÊH Y
)
ÊÊY Z
;
ÊÊZ [
DirectoryInfo
ÁÁ !
externalDir
ÁÁ" -
=
ÁÁ. /
new
ÁÁ0 3
DirectoryInfo
ÁÁ4 A
(
ÁÁA B$
_networkDriveMapLetter
ÁÁB X
)
ÁÁX Y
;
ÁÁY Z
double
ËË  
backupDriveSpaceMB
ËË -
=
ËË. /
$num
ËË0 1
,
ËË1 2(
externalBackupDriveSpaceMB
ËË3 M
=
ËËN O
$num
ËËP Q
;
ËËQ R
foreach
ÈÈ 
(
ÈÈ 
	DriveInfo
ÈÈ &
d
ÈÈ' (
in
ÈÈ) +
	allDrives
ÈÈ, 5
)
ÈÈ5 6
{
ÍÍ 
if
ÏÏ 
(
ÏÏ 
	backupDir
ÏÏ %
.
ÏÏ% &
Root
ÏÏ& *
.
ÏÏ* +
FullName
ÏÏ+ 3
==
ÏÏ4 6
d
ÏÏ7 8
.
ÏÏ8 9
Name
ÏÏ9 =
)
ÏÏ= >
{
ÌÌ  
backupDriveSpaceMB
ÓÓ .
=
ÓÓ/ 0
(
ÓÓ1 2
(
ÓÓ2 3
d
ÓÓ3 4
.
ÓÓ4 5 
AvailableFreeSpace
ÓÓ5 G
/
ÓÓH I
$num
ÓÓJ N
)
ÓÓN O
/
ÓÓP Q
$num
ÓÓR V
)
ÓÓV W
;
ÓÓW X
Globals
ÔÔ #
.
ÔÔ# $
_backupDriveSpace
ÔÔ$ 5
=
ÔÔ6 7
GetConvertedSize
ÔÔ8 H
(
ÔÔH I 
backupDriveSpaceMB
ÔÔI [
)
ÔÔ[ \
;
ÔÔ\ ]
}
 
if
ÙÙ 
(
ÙÙ 
externalDir
ÙÙ '
.
ÙÙ' (
Root
ÙÙ( ,
.
ÙÙ, -
FullName
ÙÙ- 5
==
ÙÙ6 8
d
ÙÙ9 :
.
ÙÙ: ;
Name
ÙÙ; ?
)
ÙÙ? @
{
ıı (
externalBackupDriveSpaceMB
ˆˆ 6
=
ˆˆ7 8
(
ˆˆ9 :
(
ˆˆ: ;
d
ˆˆ; <
.
ˆˆ< = 
AvailableFreeSpace
ˆˆ= O
/
ˆˆP Q
$num
ˆˆR V
)
ˆˆV W
/
ˆˆX Y
$num
ˆˆZ ^
)
ˆˆ^ _
;
ˆˆ_ `
Globals
˜˜ #
.
˜˜# $'
_externalBackupDriveSpace
˜˜$ =
=
˜˜> ?
GetConvertedSize
˜˜@ P
(
˜˜P Q(
externalBackupDriveSpaceMB
˜˜Q k
)
˜˜k l
;
˜˜l m
}
¯¯ 
}
˙˙ 
if
˚˚ 
(
˚˚ 
Globals
˚˚ 
.
˚˚  
_backupDriveSpace
˚˚  1
!=
˚˚2 4
Globals
˚˚5 <
.
˚˚< =#
_driveNotFoundMessage
˚˚= R
&&
˚˚S U
(
˚˚V W
Globals
˚˚W ^
.
˚˚^ _'
_externalBackupDriveSpace
˚˚_ x
!=
˚˚y {
Globals˚˚| É
.˚˚É Ñ%
_driveNotFoundMessage˚˚Ñ ô
||˚˚ö ú)
isCopyFolderExternalDrive˚˚ù ∂
!=˚˚∑ π
$str˚˚∫ Ω
)˚˚Ω æ
)˚˚æ ø
{
¸¸ 
double
˝˝  
_backupTotalSizeMB
˝˝ 1
=
˝˝2 3
GetDirectorySize
˝˝4 D
(
˝˝D E
Globals
˝˝E L
.
˝˝L M
_backupFolderPath
˝˝M ^
)
˝˝^ _
;
˝˝_ `
double
˛˛ (
_backupPrecautionarySizeMB
˛˛ 9
=
˛˛: ; 
_backupTotalSizeMB
˛˛< N
*
˛˛O P
$num
˛˛Q R
;
˛˛R S
if
ˇˇ 
(
ˇˇ (
_backupPrecautionarySizeMB
ˇˇ 6
>
ˇˇ7 8 
backupDriveSpaceMB
ˇˇ9 K
||
ˇˇL N
(
ˇˇO P(
_backupPrecautionarySizeMB
ˇˇP j
>
ˇˇk l)
externalBackupDriveSpaceMBˇˇm á
&&ˇˇà ä)
isCopyFolderExternalDriveˇˇã §
==ˇˇ• ß
$strˇˇ® ´
)ˇˇ´ ¨
)ˇˇ¨ ≠
{
ÄÄ (
_subjectDiskWarningMessage
ÅÅ 6
=
ÅÅ7 8
$str
ÅÅ9 S
;
ÅÅS T
}
ÇÇ 
else
ÉÉ 
if
ÉÉ 
(
ÉÉ  ! 
_backupTotalSizeMB
ÉÉ! 3
>
ÉÉ4 5 
backupDriveSpaceMB
ÉÉ6 H
||
ÉÉI K
(
ÉÉL M 
_backupTotalSizeMB
ÉÉM _
>
ÉÉ` a(
externalBackupDriveSpaceMB
ÉÉb |
&&
ÉÉ} )
isCopyFolderExternalDriveÉÉÄ ô
==ÉÉö ú
$strÉÉù †
)ÉÉ† °
)ÉÉ° ¢
{
ÑÑ (
_subjectDiskWarningMessage
ÖÖ 6
=
ÖÖ7 8
$str
ÖÖ9 V
;
ÖÖV W
}
ÜÜ 
if
áá 
(
áá (
_subjectDiskWarningMessage
áá 6
!=
áá7 9
string
áá: @
.
áá@ A
Empty
ááA F
)
ááF G
{
àà 
_subject
ââ $
+=
ââ% '(
_subjectDiskWarningMessage
ââ( B
;
ââB C
}
ää 
}
ãã 
_body
çç 
+=
çç 
string
çç #
.
çç# $
Format
çç$ *
(
çç* +
$str
çç+ n
,
ççn o
	backupDir
ççp y
.
ççy z
Root
ççz ~
.
çç~ 
FullNameçç á
,ççá à
Globalsççâ ê
.ççê ë!
_backupDriveSpaceççë ¢
)çç¢ £
;çç£ §
if
éé 
(
éé '
isCopyFolderExternalDrive
éé 1
==
éé2 4
$str
éé5 8
)
éé8 9
{
èè 
_body
êê 
+=
êê  
string
êê! '
.
êê' (
Format
êê( .
(
êê. /
$str
êê/ v
,
êêv w
externalDirêêx É
.êêÉ Ñ
RootêêÑ à
.êêà â
FullNameêêâ ë
,êêë í
Globalsêêì ö
.êêö õ)
_externalBackupDriveSpaceêêõ ¥
)êê¥ µ
;êêµ ∂
}
ëë 
DateTime
îî 
_endTime
îî %
=
îî& '
DateTime
îî( 0
.
îî0 1
Now
îî1 4
;
îî4 5
Globals
ïï 
.
ïï 
_totalBackupTime
ïï ,
=
ïï- .
_endTime
ïï/ 7
.
ïï7 8
Subtract
ïï8 @
(
ïï@ A
Globals
ïïA H
.
ïïH I
_today
ïïI O
)
ïïO P
;
ïïP Q
string
ññ 
_timeSuffix
ññ &
=
ññ' (
GetTimeInText
ññ) 6
(
ññ6 7
Globals
ññ7 >
.
ññ> ?
_totalBackupTime
ññ? O
)
ññO P
;
ññP Q
_body
óó 
+=
óó 
string
óó #
.
óó# $
Format
óó$ *
(
óó* +
$str
óó+ g
,
óóg h
_timeSuffix
óói t
)
óót u
;
óóu v
if
ôô 
(
ôô 
!
ôô 
string
ôô 
.
ôô  
IsNullOrEmpty
ôô  -
(
ôô- .
Globals
ôô. 5
.
ôô5 6
_errorStackTrace
ôô6 F
)
ôôF G
)
ôôG H
{
öö 
_body
õõ 
+=
õõ  
(
õõ! "
$str
õõ" C
+
õõD E
Globals
õõF M
.
õõM N
_errorStackTrace
õõN ^
)
õõ^ _
;
õõ_ `
}
úú 
}
ùù 
catch
ûû 
(
ûû 
	Exception
ûû  
ex
ûû! #
)
ûû# $
{
üü 
Globals
†† 
.
†† 
_errorStackTrace
†† ,
+=
††- /
string
††0 6
.
††6 7
Format
††7 =
(
††= >
$str
††> U
,
††U V
ex
††W Y
.
††Y Z
Message
††Z a
,
††a b
ex
††c e
.
††e f

StackTrace
††f p
)
††p q
;
††q r
}
°° 
try
¢¢ 
{
££ 

EmailModel
§§ 

emailModel
§§ )
=
§§* +
new
§§, /

EmailModel
§§0 :
(
§§: ;
)
§§; <
{
•• 
To
¶¶ 
=
¶¶ 
_adminEmailID
¶¶ *
,
¶¶* +
Subject
ßß 
=
ßß  !
string
ßß" (
.
ßß( )
Format
ßß) /
(
ßß/ 0
_subject
ßß0 8
,
ßß8 9
Globals
ßß: A
.
ßßA B"
_backupSystemDetails
ßßB V
)
ßßV W
,
ßßW X
Body
®® 
=
®® 
_body
®® $
}
©© 
;
©© 
EmailService
™™  
emailService
™™! -
=
™™. /
new
™™0 3
EmailService
™™4 @
(
™™@ A
)
™™A B
;
™™B C
emailService
´´  
.
´´  !
	SendEmail
´´! *
(
´´* +

emailModel
´´+ 5
)
´´5 6
;
´´6 7
Environment
¨¨ 
.
¨¨  
Exit
¨¨  $
(
¨¨$ %
$num
¨¨% &
)
¨¨& '
;
¨¨' (
}
≠≠ 
catch
ÆÆ 
(
ÆÆ 
	Exception
ÆÆ  
ex
ÆÆ! #
)
ÆÆ# $
{
ØØ 
SaveErrorLog
∞∞  
(
∞∞  !
ex
∞∞! #
)
∞∞# $
;
∞∞$ %
}
±± 
}
≤≤ 
}
≥≥ 	
public
µµ 
static
µµ 
async
µµ 
Task
µµ  )
TakeUploadFolderBackupAsync
µµ! <
(
µµ< =
string
µµ= C
driveLetter
µµD O
)
µµO P
{
∂∂ 	
try
∑∑ 
{
∏∏ 
if
ππ 
(
ππ 
Globals
ππ 
.
ππ &
isTakeBackupUploadFolder
ππ 4
==
ππ5 7
$str
ππ8 ;
)
ππ; <
{
∫∫ 
driveLetter
ªª 
=
ªª  !
Path
ªª" &
.
ªª& '
GetPathRoot
ªª' 2
(
ªª2 3
Globals
ªª3 :
.
ªª: ;
_psFilePath
ªª; F
)
ªªF G
;
ªªG H
if
ºº 
(
ºº 
!
ºº 
	Directory
ºº "
.
ºº" #
Exists
ºº# )
(
ºº) *
driveLetter
ºº* 5
)
ºº5 6
)
ºº6 7
{
ΩΩ 
Globals
ææ 
.
ææ  (
boolFolderBackupSuccessful
ææ  :
=
ææ; <
false
ææ= B
;
ææB C
Globals
øø 
.
øø  #
_folderBackupFileSize
øø  5
=
øø6 7
$str
øø8 A
+
øøB C
Globals
øøD K
.
øøK L#
_driveNotFoundMessage
øøL a
;
øøa b
}
¿¿ 
else
¡¡ 
{
¬¬ 
Globals
√√ 
.
√√  %
_uploadFolderBackupFile
√√  7
=
√√8 9
string
√√: @
.
√√@ A
Format
√√A G
(
√√G H
$str
√√H Y
+
√√Z [
$str
√√\ `
+
√√a b
$str
√√c w
+
√√x y
$str√√z Ö
,√√Ö Ü
Globals√√á é
.√√é è!
_scanDocuFilePath√√è †
,√√† °
Globals√√¢ ©
.√√© ™
_today√√™ ∞
,√√∞ ±
Globals√√≤ π
.√√π ∫
_today√√∫ ¿
)√√¿ ¡
;√√¡ ¬
driveLetter
ƒƒ #
=
ƒƒ$ %
Path
ƒƒ& *
.
ƒƒ* +
GetPathRoot
ƒƒ+ 6
(
ƒƒ6 7
Globals
ƒƒ7 >
.
ƒƒ> ?%
_uploadFolderBackupFile
ƒƒ? V
)
ƒƒV W
;
ƒƒW X
if
≈≈ 
(
≈≈ 
!
≈≈ 
	Directory
≈≈ &
.
≈≈& '
Exists
≈≈' -
(
≈≈- .
driveLetter
≈≈. 9
)
≈≈9 :
)
≈≈: ;
{
∆∆ 
Globals
«« #
.
««# $(
boolFolderBackupSuccessful
««$ >
=
««? @
false
««A F
;
««F G
Globals
»» #
.
»»# $#
_folderBackupFileSize
»»$ 9
=
»»: ;
$str
»»< J
+
»»K L
Globals
»»M T
.
»»T U#
_driveNotFoundMessage
»»U j
;
»»j k
}
…… 
else
   
{
ÀÀ 
Console
ÃÃ #
.
ÃÃ# $
	WriteLine
ÃÃ$ -
(
ÃÃ- .
$str
ÃÃ. I
)
ÃÃI J
;
ÃÃJ K
DateTime
ÕÕ $$
_uploadBackupStartTime
ÕÕ% ;
=
ÕÕ< =
DateTime
ÕÕ> F
.
ÕÕF G
Now
ÕÕG J
;
ÕÕJ K
Globals
ŒŒ #
.
ŒŒ# $(
boolFolderBackupSuccessful
ŒŒ$ >
=
ŒŒ? @
BackUpFolderCopy
ŒŒA Q
(
ŒŒQ R
Globals
ŒŒR Y
.
ŒŒY Z
_psFilePath
ŒŒZ e
,
ŒŒe f
Globals
ŒŒg n
.
ŒŒn o&
_uploadFolderBackupFileŒŒo Ü
,ŒŒÜ á
GlobalsŒŒà è
.ŒŒè ê
_todayŒŒê ñ
,ŒŒñ ó
refŒŒò õ
GlobalsŒŒú £
.ŒŒ£ § 
_errorStackTraceŒŒ§ ¥
)ŒŒ¥ µ
;ŒŒµ ∂
DateTime
œœ $"
_uploadBackupEndTime
œœ% 9
=
œœ: ;
DateTime
œœ< D
.
œœD E
Now
œœE H
;
œœH I
Globals
–– #
.
––# $$
_totalFolderBackupTime
––$ :
=
––; <"
_uploadBackupEndTime
––= Q
.
––Q R
Subtract
––R Z
(
––Z [$
_uploadBackupStartTime
––[ q
)
––q r
;
––r s
Console
—— #
.
——# $
	WriteLine
——$ -
(
——- .
$str
——. K
)
——K L
;
——L M
}
““ 
}
”” 
}
‘‘ 
}
’’ 
catch
÷÷ 
(
÷÷ 
	Exception
÷÷ 
ex
÷÷ 
)
÷÷  
{
◊◊ 
SaveErrorLog
ÿÿ 
(
ÿÿ 
ex
ÿÿ 
)
ÿÿ  
;
ÿÿ  !
}
ŸŸ 
}
⁄⁄ 	
public
€€ 
static
€€ 
async
€€ 
Task
€€  ,
TakeDataSheetFolderBackupAsync
€€! ?
(
€€? @
string
€€@ F
driveLetter
€€G R
)
€€R S
{
‹‹ 	
try
›› 
{
ﬁﬁ 
if
ﬂﬂ 
(
ﬂﬂ 
Globals
ﬂﬂ 
.
ﬂﬂ %
boolTakeDatasheetBackup
ﬂﬂ 3
)
ﬂﬂ3 4
{
‡‡ 
driveLetter
·· 
=
··  !
Path
··" &
.
··& '
GetPathRoot
··' 2
(
··2 3
Globals
··3 :
.
··: ; 
_datasheetFilePath
··; M
)
··M N
;
··N O
if
‚‚ 
(
‚‚ 
!
‚‚ 
	Directory
‚‚ "
.
‚‚" #
Exists
‚‚# )
(
‚‚) *
driveLetter
‚‚* 5
)
‚‚5 6
)
‚‚6 7
{
„„ 
Globals
‰‰ 
.
‰‰  +
boolDatasheetBackupSuccessful
‰‰  =
=
‰‰> ?
false
‰‰@ E
;
‰‰E F
Globals
ÂÂ 
.
ÂÂ  &
_datasheetBackupFileSize
ÂÂ  8
=
ÂÂ9 :
$str
ÂÂ; D
+
ÂÂE F
Globals
ÂÂG N
.
ÂÂN O#
_driveNotFoundMessage
ÂÂO d
;
ÂÂd e
}
ÊÊ 
else
ÁÁ 
{
ËË 
Globals
ÈÈ 
.
ÈÈ  (
_datasheetFolderBackupFile
ÈÈ  :
=
ÈÈ; <
string
ÈÈ= C
.
ÈÈC D
Format
ÈÈD J
(
ÈÈJ K
$str
ÈÈK \
+
ÈÈ] ^
$str
ÈÈ_ c
+
ÈÈd e
$str
ÈÈf z
+
ÈÈ{ |
$strÈÈ} ã
,ÈÈã å
GlobalsÈÈç î
.ÈÈî ï!
_scanDocuFilePathÈÈï ¶
,ÈÈ¶ ß
GlobalsÈÈ® Ø
.ÈÈØ ∞
_todayÈÈ∞ ∂
,ÈÈ∂ ∑
GlobalsÈÈ∏ ø
.ÈÈø ¿
_todayÈÈ¿ ∆
)ÈÈ∆ «
;ÈÈ« »
driveLetter
ÍÍ #
=
ÍÍ$ %
Path
ÍÍ& *
.
ÍÍ* +
GetPathRoot
ÍÍ+ 6
(
ÍÍ6 7
Globals
ÍÍ7 >
.
ÍÍ> ?(
_datasheetFolderBackupFile
ÍÍ? Y
)
ÍÍY Z
;
ÍÍZ [
if
ÎÎ 
(
ÎÎ 
!
ÎÎ 
	Directory
ÎÎ &
.
ÎÎ& '
Exists
ÎÎ' -
(
ÎÎ- .
driveLetter
ÎÎ. 9
)
ÎÎ9 :
)
ÎÎ: ;
{
ÏÏ 
Globals
ÌÌ #
.
ÌÌ# $+
boolDatasheetBackupSuccessful
ÌÌ$ A
=
ÌÌB C
false
ÌÌD I
;
ÌÌI J
Globals
ÓÓ #
.
ÓÓ# $&
_datasheetBackupFileSize
ÓÓ$ <
=
ÓÓ= >
$str
ÓÓ? M
+
ÓÓN O
Globals
ÓÓP W
.
ÓÓW X#
_driveNotFoundMessage
ÓÓX m
;
ÓÓm n
}
ÔÔ 
else
 
{
ÒÒ 
Console
ÚÚ #
.
ÚÚ# $
	WriteLine
ÚÚ$ -
(
ÚÚ- .
$str
ÚÚ. L
)
ÚÚL M
;
ÚÚM N
DateTime
ÛÛ $'
_dataSheetBackupStartTime
ÛÛ% >
=
ÛÛ? @
DateTime
ÛÛA I
.
ÛÛI J
Now
ÛÛJ M
;
ÛÛM N
Globals
ÙÙ #
.
ÙÙ# $+
boolDatasheetBackupSuccessful
ÙÙ$ A
=
ÙÙB C
BackUpFolderCopy
ÙÙD T
(
ÙÙT U
Globals
ÙÙU \
.
ÙÙ\ ] 
_datasheetFilePath
ÙÙ] o
,
ÙÙo p
Globals
ÙÙq x
.
ÙÙx y)
_datasheetFolderBackupFileÙÙy ì
,ÙÙì î
GlobalsÙÙï ú
.ÙÙú ù
_todayÙÙù £
,ÙÙ£ §
refÙÙ• ®
GlobalsÙÙ© ∞
.ÙÙ∞ ± 
_errorStackTraceÙÙ± ¡
)ÙÙ¡ ¬
;ÙÙ¬ √
DateTime
ıı $%
_dataSheetBackupEndTime
ıı% <
=
ıı= >
DateTime
ıı? G
.
ııG H
Now
ııH K
;
ııK L
Globals
ˆˆ #
.
ˆˆ# $'
_totalDataSheetBackupTime
ˆˆ$ =
=
ˆˆ> ?%
_dataSheetBackupEndTime
ˆˆ@ W
.
ˆˆW X
Subtract
ˆˆX `
(
ˆˆ` a'
_dataSheetBackupStartTime
ˆˆa z
)
ˆˆz {
;
ˆˆ{ |
Console
˜˜ #
.
˜˜# $
	WriteLine
˜˜$ -
(
˜˜- .
$str
˜˜. N
)
˜˜N O
;
˜˜O P
}
¯¯ 
}
˘˘ 
}
˙˙ 
}
˚˚ 
catch
¸¸ 
(
¸¸ 
	Exception
¸¸ 
ex
¸¸ 
)
¸¸  
{
˝˝ 
SaveErrorLog
˛˛ 
(
˛˛ 
ex
˛˛ 
)
˛˛  
;
˛˛  !
}
ˇˇ 
}
ÄÄ 	
public
ÉÉ 
static
ÉÉ 
void
ÉÉ *
SetServiceStatusErrorMessage
ÉÉ 7
(
ÉÉ7 8
string
ÉÉ8 >
pServiceName
ÉÉ? K
,
ÉÉK L
string
ÉÉM S
pServiceStatus
ÉÉT b
)
ÉÉb c
{
ÑÑ 	
Globals
ÖÖ 
.
ÖÖ 
_errorStackTrace
ÖÖ $
+=
ÖÖ% '
string
ÖÖ( .
.
ÖÖ. /
Format
ÖÖ/ 5
(
ÖÖ5 6
$str
ÖÖ6 x
,
ÖÖx y
pServiceNameÖÖz Ü
,ÖÖÜ á
pServiceStatusÖÖà ñ
)ÖÖñ ó
;ÖÖó ò
}
ÜÜ 	
public
àà 
static
àà 
async
àà 
Task
àà  $
TakeMySQLDBBackupAsync
àà! 7
(
àà7 8
)
àà8 9
{
ââ 	
try
ää 
{
ãã 
ServiceController
åå !"
scMysqlServiceStatus
åå" 6
=
åå7 8
new
åå9 <
ServiceController
åå= N
(
ååN O
Globals
ååO V
.
ååV W
_mySqlServiceName
ååW h
)
ååh i
;
ååi j
if
éé 
(
éé "
scMysqlServiceStatus
éé (
.
éé( )
Status
éé) /
==
éé0 2%
ServiceControllerStatus
éé3 J
.
ééJ K
Running
ééK R
)
ééR S
{
èè 
Console
êê 
.
êê 
	WriteLine
êê %
(
êê% &
$str
êê& @
)
êê@ A
;
êêA B
DateTime
ëë #
_mySQLBackupStartTime
ëë 2
=
ëë3 4
DateTime
ëë5 =
.
ëë= >
Now
ëë> A
;
ëëA B
string
íí #
_mySqlBackupBatchFile
íí 0
=
íí1 2%
WebConfigurationManager
íí3 J
.
ííJ K
AppSettings
ííK V
[
ííV W
$str
ííW m
]
íím n
.
íín o
ToString
íío w
(
ííw x
)
ííx y
;
ííy z
string
ìì !
_MysqlDbDumpExePath
ìì .
=
ìì/ 0%
WebConfigurationManager
ìì1 H
.
ììH I
AppSettings
ììI T
[
ììT U
$str
ììU i
]
ììi j
.
ììj k
ToString
ììk s
(
ììs t
)
ììt u
;
ììu v
string
îî 
_MysqlUserName
îî )
=
îî* +%
WebConfigurationManager
îî, C
.
îîC D
AppSettings
îîD O
[
îîO P
$str
îîP _
]
îî_ `
.
îî` a
ToString
îîa i
(
îîi j
)
îîj k
;
îîk l
string
ïï 
_MysqlPassword
ïï )
=
ïï* +%
WebConfigurationManager
ïï, C
.
ïïC D
AppSettings
ïïD O
[
ïïO P
$str
ïïP _
]
ïï_ `
.
ïï` a
ToString
ïïa i
(
ïïi j
)
ïïj k
;
ïïk l
Globals
ññ 
.
ññ 
_mysqlBackupFile
ññ ,
=
ññ- .
string
ññ/ 5
.
ññ5 6
Format
ññ6 <
(
ññ< =
$str
ññ= ~
,
ññ~ 
GlobalsññÄ á
.ññá à!
_scanDocuFilePathññà ô
,ññô ö
Globalsññõ ¢
.ññ¢ £
_todayññ£ ©
,ññ© ™
Globalsññ´ ≤
.ññ≤ ≥
_todayññ≥ π
,ññπ ∫
Globalsññª ¬
.ññ¬ √
_todayññ√ …
,ññ…  
GlobalsññÀ “
.ññ“ ”
_MysqlDBNameññ” ﬂ
)ññﬂ ‡
;ññ‡ ·
string
óó 
_str
óó 
=
óó  !
string
óó" (
.
óó( )
Format
óó) /
(
óó/ 0
$str
óó0 4
+
óó5 6"
@_MysqlDbDumpExePath
óó7 K
+
óóL M
$str
óóN R
+
óóS T
$str
óóU [
+
óó\ ]
_MysqlUserName
óó^ l
+
óóm n
$str
óóo t
+
óóu v
_MysqlPasswordóów Ö
+óóÜ á
$stróóà ◊
+óóÿ Ÿ
Globalsóó⁄ ·
.óó· ‚
_MysqlDBNameóó‚ Ó
+óóÔ 
$stróóÒ ˘
,óó˘ ˙
Globalsóó˚ Ç
.óóÇ É 
_mysqlBackupFileóóÉ ì
)óóì î
;óóî ï
File
ùù 
.
ùù 
WriteAllText
ùù %
(
ùù% &$
@_mySqlBackupBatchFile
ùù& <
,
ùù< =
_str
ùù> B
)
ùùB C
;
ùùC D
ProcessStartInfo
†† $ 
DBProcessStartInfo
††% 7
=
††8 9
new
††: =
ProcessStartInfo
††> N
(
††N O$
@_mySqlBackupBatchFile
††O e
)
††e f
{
°° 
WindowStyle
££ #
=
££$ % 
ProcessWindowStyle
££& 8
.
££8 9
Normal
££9 ?
,
££? @
UseShellExecute
§§ '
=
§§( )
false
§§* /
}
•• 
;
•• 
Process
®® 
	dbProcess
®® %
;
®®% &
	dbProcess
©© 
=
©© 
Process
©©  '
.
©©' (
Start
©©( -
(
©©- . 
DBProcessStartInfo
©©. @
)
©©@ A
;
©©A B
	dbProcess
™™ 
.
™™ 
WaitForExit
™™ )
(
™™) *
)
™™* +
;
™™+ ,
if
¨¨ 
(
¨¨ 
Globals
¨¨ 
.
¨¨  !
_isCompressedBackup
¨¨  3
==
¨¨4 6
$str
¨¨7 :
)
¨¨: ;
{
≠≠ 
Globals
ÆÆ 
.
ÆÆ  "
_gZipMysqlBackupFile
ÆÆ  4
=
ÆÆ5 6
Globals
ÆÆ7 >
.
ÆÆ> ?
_mysqlBackupFile
ÆÆ? O
+
ÆÆP Q
Globals
ÆÆR Y
.
ÆÆY Z&
_compressedFileExtension
ÆÆZ r
;
ÆÆr s0
"CompressToZipFileAndDeleteOriginal
ØØ :
(
ØØ: ;
Globals
ØØ; B
.
ØØB C
_mysqlBackupFile
ØØC S
)
ØØS T
;
ØØT U
}
∞∞ 
if
±± 
(
±± 
	dbProcess
±± !
.
±±! "
ExitCode
±±" *
==
±±+ -
$num
±±. /
)
±±/ 0
{
≤≤ 
Globals
≥≥ 
.
≥≥  '
boolMysqlBackupSuccessful
≥≥  9
=
≥≥: ;
true
≥≥< @
;
≥≥@ A
}
¥¥ 
	dbProcess
µµ 
.
µµ 
Close
µµ #
(
µµ# $
)
µµ$ %
;
µµ% &
DateTime
∂∂ !
_mySQLBackupEndTime
∂∂ 0
=
∂∂1 2
DateTime
∂∂3 ;
.
∂∂; <
Now
∂∂< ?
;
∂∂? @
Globals
∑∑ 
.
∑∑ #
_totalMySQLBackupTime
∑∑ 1
=
∑∑2 3!
_mySQLBackupEndTime
∑∑4 G
.
∑∑G H
Subtract
∑∑H P
(
∑∑P Q#
_mySQLBackupStartTime
∑∑Q f
)
∑∑f g
;
∑∑g h
Console
∏∏ 
.
∏∏ 
	WriteLine
∏∏ %
(
∏∏% &
$str
∏∏& B
)
∏∏B C
;
∏∏C D
}
ππ 
else
∫∫ 
{
ªª *
SetServiceStatusErrorMessage
ºº 0
(
ºº0 1
Globals
ºº1 8
.
ºº8 9
_mySqlServiceName
ºº9 J
,
ººJ K"
scMysqlServiceStatus
ººL `
.
ºº` a
Status
ººa g
.
ººg h
ToString
ººh p
(
ººp q
)
ººq r
)
ººr s
;
ººs t
}
ΩΩ 
}
ææ 
catch
øø 
(
øø 
	Exception
øø 
ex
øø 
)
øø  
{
¿¿ 
SaveErrorLog
¡¡ 
(
¡¡ 
ex
¡¡ 
)
¡¡  
;
¡¡  !
}
¬¬ 
}
√√ 	
public
ƒƒ 
static
ƒƒ 
async
ƒƒ 
Task
ƒƒ  ,
TakeMySQLIdentityDBBackupAsync
ƒƒ! ?
(
ƒƒ? @
)
ƒƒ@ A
{
≈≈ 	
try
∆∆ 
{
«« 
ServiceController
»» !"
scMysqlServiceStatus
»»" 6
=
»»7 8
new
»»9 <
ServiceController
»»= N
(
»»N O
Globals
»»O V
.
»»V W
_mySqlServiceName
»»W h
)
»»h i
;
»»i j
if
   
(
   "
scMysqlServiceStatus
   (
.
  ( )
Status
  ) /
==
  0 2%
ServiceControllerStatus
  3 J
.
  J K
Running
  K R
)
  R S
{
ÀÀ 
Console
ÃÃ 
.
ÃÃ 
	WriteLine
ÃÃ %
(
ÃÃ% &
$str
ÃÃ& L
)
ÃÃL M
;
ÃÃM N
DateTime
ÕÕ +
_mySQLIdentityBackupStartTime
ÕÕ :
=
ÕÕ; <
DateTime
ÕÕ= E
.
ÕÕE F
Now
ÕÕF I
;
ÕÕI J
string
ŒŒ +
_mysqlIdentityBackupBatchFile
ŒŒ 8
=
ŒŒ9 :%
WebConfigurationManager
ŒŒ; R
.
ŒŒR S
AppSettings
ŒŒS ^
[
ŒŒ^ _
$str
ŒŒ_ }
]
ŒŒ} ~
.
ŒŒ~ 
ToStringŒŒ á
(ŒŒá à
)ŒŒà â
;ŒŒâ ä
string
œœ )
_MysqlIdentityDbDumpExePath
œœ 6
=
œœ7 8%
WebConfigurationManager
œœ9 P
.
œœP Q
AppSettings
œœQ \
[
œœ\ ]
$str
œœ] q
]
œœq r
.
œœr s
ToString
œœs {
(
œœ{ |
)
œœ| }
;
œœ} ~
string
–– $
_MysqlIdentityUserName
–– 1
=
––2 3%
WebConfigurationManager
––4 K
.
––K L
AppSettings
––L W
[
––W X
$str
––X g
]
––g h
.
––h i
ToString
––i q
(
––q r
)
––r s
;
––s t
string
—— $
_MysqlIdentityPassword
—— 1
=
——2 3%
WebConfigurationManager
——4 K
.
——K L
AppSettings
——L W
[
——W X
$str
——X g
]
——g h
.
——h i
ToString
——i q
(
——q r
)
——r s
;
——s t
Globals
““ 
.
““ &
_mysqlIdentityBackupFile
““ 4
=
““5 6
string
““7 =
.
““= >
Format
““> D
(
““D E
$str““E Ü
,““Ü á
Globals““à è
.““è ê!
_scanDocuFilePath““ê °
,““° ¢
Globals““£ ™
.““™ ´
_today““´ ±
,““± ≤
Globals““≥ ∫
.““∫ ª
_today““ª ¡
,““¡ ¬
Globals““√  
.““  À
_today““À —
,““— “
Globals““” ⁄
.““⁄ €$
_MysqlIdentityDBName““€ Ô
)““Ô 
;““ Ò
string
”” 
_strIdentity
”” '
=
””( )
string
””* 0
.
””0 1
Format
””1 7
(
””7 8
$str
””8 <
+
””= >*
@_MysqlIdentityDbDumpExePath
””? [
+
””\ ]
$str
””^ b
+
””c d
$str
””e k
+
””l m%
_MysqlIdentityUserName””n Ñ
+””Ö Ü
$str””á å
+””ç é&
_MysqlIdentityPassword””è •
+””¶ ß
$str””® ˜
+””¯ ˘
Globals””˙ Å
.””Å Ç$
_MysqlIdentityDBName””Ç ñ
+””ó ò
$str””ô °
,””° ¢
Globals””£ ™
.””™ ´(
_mysqlIdentityBackupFile””´ √
)””√ ƒ
;””ƒ ≈
File
ŸŸ 
.
ŸŸ 
WriteAllText
ŸŸ %
(
ŸŸ% &,
@_mysqlIdentityBackupBatchFile
ŸŸ& D
,
ŸŸD E
_strIdentity
ŸŸF R
)
ŸŸR S
;
ŸŸS T
ProcessStartInfo
‹‹ $ 
DBProcessStartInfo
‹‹% 7
=
‹‹8 9
new
‹‹: =
ProcessStartInfo
‹‹> N
(
‹‹N O,
@_mysqlIdentityBackupBatchFile
‹‹O m
)
‹‹m n
{
›› 
WindowStyle
ﬂﬂ #
=
ﬂﬂ$ % 
ProcessWindowStyle
ﬂﬂ& 8
.
ﬂﬂ8 9
Normal
ﬂﬂ9 ?
,
ﬂﬂ? @
UseShellExecute
‡‡ '
=
‡‡( )
false
‡‡* /
}
·· 
;
·· 
Process
‰‰ 
	dbProcess
‰‰ %
;
‰‰% &
	dbProcess
ÂÂ 
=
ÂÂ 
Process
ÂÂ  '
.
ÂÂ' (
Start
ÂÂ( -
(
ÂÂ- . 
DBProcessStartInfo
ÂÂ. @
)
ÂÂ@ A
;
ÂÂA B
	dbProcess
ÊÊ 
.
ÊÊ 
WaitForExit
ÊÊ )
(
ÊÊ) *
)
ÊÊ* +
;
ÊÊ+ ,
if
ÁÁ 
(
ÁÁ 
	dbProcess
ÁÁ !
.
ÁÁ! "
ExitCode
ÁÁ" *
==
ÁÁ+ -
$num
ÁÁ. /
)
ÁÁ/ 0
{
ËË 
if
ÍÍ 
(
ÍÍ 
Globals
ÍÍ #
.
ÍÍ# $!
_isCompressedBackup
ÍÍ$ 7
==
ÍÍ8 :
$str
ÍÍ; >
)
ÍÍ> ?
{
ÎÎ 
Globals
ÏÏ #
.
ÏÏ# $*
_gZipMysqlIdentityBackupFile
ÏÏ$ @
=
ÏÏA B
Globals
ÏÏC J
.
ÏÏJ K&
_mysqlIdentityBackupFile
ÏÏK c
+
ÏÏd e
Globals
ÏÏf m
.
ÏÏm n'
_compressedFileExtensionÏÏn Ü
;ÏÏÜ á0
"CompressToZipFileAndDeleteOriginal
ÌÌ >
(
ÌÌ> ?
Globals
ÌÌ? F
.
ÌÌF G&
_mysqlIdentityBackupFile
ÌÌG _
)
ÌÌ_ `
;
ÌÌ` a
}
ÓÓ 
Globals
ÔÔ 
.
ÔÔ  /
!boolMysqlIdentityBackupSuccessful
ÔÔ  A
=
ÔÔB C
true
ÔÔD H
;
ÔÔH I
}
 
	dbProcess
ÒÒ 
.
ÒÒ 
Close
ÒÒ #
(
ÒÒ# $
)
ÒÒ$ %
;
ÒÒ% &
DateTime
ÚÚ )
_mySQLIdentityBackupEndTime
ÚÚ 8
=
ÚÚ9 :
DateTime
ÚÚ; C
.
ÚÚC D
Now
ÚÚD G
;
ÚÚG H
Globals
ÛÛ 
.
ÛÛ +
_totalMySQLIdentityBackupTime
ÛÛ 9
=
ÛÛ: ;)
_mySQLIdentityBackupEndTime
ÛÛ< W
.
ÛÛW X
Subtract
ÛÛX `
(
ÛÛ` a+
_mySQLIdentityBackupStartTime
ÛÛa ~
)
ÛÛ~ 
;ÛÛ Ä
Console
ÙÙ 
.
ÙÙ 
	WriteLine
ÙÙ %
(
ÙÙ% &
$str
ÙÙ& N
)
ÙÙN O
;
ÙÙO P
}
ıı 
else
ˆˆ 
{
˜˜ *
SetServiceStatusErrorMessage
¯¯ 0
(
¯¯0 1
Globals
¯¯1 8
.
¯¯8 9
_mySqlServiceName
¯¯9 J
,
¯¯J K"
scMysqlServiceStatus
¯¯L `
.
¯¯` a
Status
¯¯a g
.
¯¯g h
ToString
¯¯h p
(
¯¯p q
)
¯¯q r
)
¯¯r s
;
¯¯s t
}
˘˘ 
}
˙˙ 
catch
˚˚ 
(
˚˚ 
	Exception
˚˚ 
ex
˚˚ 
)
˚˚  
{
¸¸ 
SaveErrorLog
˝˝ 
(
˝˝ 
ex
˝˝ 
)
˝˝  
;
˝˝  !
}
˛˛ 
}
ˇˇ 	
public
ÄÄ 
static
ÄÄ 
async
ÄÄ 
Task
ÄÄ  $
TakeMongoDBBackupAsync
ÄÄ! 7
(
ÄÄ7 8
)
ÄÄ8 9
{
ÅÅ 	
try
ÇÇ 
{
ÉÉ 
ServiceController
ÑÑ !$
scMongoDBServiceStatus
ÑÑ" 8
=
ÑÑ9 :
new
ÑÑ; >
ServiceController
ÑÑ? P
(
ÑÑP Q
Globals
ÑÑQ X
.
ÑÑX Y!
_mongoDBServiceName
ÑÑY l
)
ÑÑl m
;
ÑÑm n
if
ÜÜ 
(
ÜÜ $
scMongoDBServiceStatus
ÜÜ *
.
ÜÜ* +
Status
ÜÜ+ 1
==
ÜÜ2 4%
ServiceControllerStatus
ÜÜ5 L
.
ÜÜL M
Running
ÜÜM T
)
ÜÜT U
{
áá 
Console
àà 
.
àà 
	WriteLine
àà %
(
àà% &
$str
àà& C
)
ààC D
;
ààD E
DateTime
ââ %
_mongoDBBackupStartTime
ââ 4
=
ââ5 6
DateTime
ââ7 ?
.
ââ? @
Now
ââ@ C
;
ââC D
string
ää !
_mongoDbDumpExePath
ää .
=
ää/ 0%
WebConfigurationManager
ää1 H
.
ääH I
AppSettings
ääI T
[
ääT U
$str
ääU i
]
ääi j
.
ääj k
ToString
ääk s
(
ääs t
)
äät u
;
ääu v
string
ãã 
_mongoDbHostName
ãã +
=
ãã, -%
WebConfigurationManager
ãã. E
.
ããE F
AppSettings
ããF Q
[
ããQ R
$str
ããR c
]
ããc d
.
ããd e
ToString
ããe m
(
ããm n
)
ããn o
;
ãão p
string
åå 
_mongoDbPort
åå '
=
åå( )%
WebConfigurationManager
åå* A
.
ååA B
AppSettings
ååB M
[
ååM N
$str
ååN [
]
åå[ \
.
åå\ ]
ToString
åå] e
(
ååe f
)
ååf g
;
ååg h
string
çç 
_mongoDBUserName
çç +
=
çç, -%
WebConfigurationManager
çç. E
.
ççE F
AppSettings
ççF Q
[
ççQ R
$str
ççR c
]
ççc d
.
ççd e
ToString
ççe m
(
ççm n
)
ççn o
;
çço p
string
éé 
_mongoDBPassword
éé +
=
éé, -%
WebConfigurationManager
éé. E
.
ééE F
AppSettings
ééF Q
[
ééQ R
$str
ééR c
]
ééc d
.
ééd e
ToString
éée m
(
éém n
)
één o
;
ééo p
string
êê '
_mongoDbBackupBatFilePath
êê 4
=
êê5 6%
WebConfigurationManager
êê7 N
.
êêN O
AppSettings
êêO Z
[
êêZ [
$str
êê[ q
]
êêq r
.
êêr s
ToString
êês {
(
êê{ |
)
êê| }
;
êê} ~
string
ëë 
shellCmd
ëë #
=
ëë$ %
$str
ëë& *
+
ëë+ ,"
@_mongoDbDumpExePath
ëë- A
+
ëëB C
$str
ëëD O
+
ëëP Q
$str
ëëR V
+
ëëW X
$str
ëëY c
+
ëëd e
_mongoDbHostName
ëëf v
+
ëëw x
$strëëy É
+ëëÑ Ö
_mongoDbPortëëÜ í
+ëëì î
$strëëï £
+ëë§ • 
_mongoDBUserNameëë¶ ∂
+ëë∑ ∏
$strëëπ «
+ëë» … 
_mongoDBPasswordëë  ⁄
+ëë€ ‹
$strëë› Â
+ëëÊ Á
GlobalsëëË Ô
.ëëÔ $
_mongoDbDatabaseNameëë Ñ
+ëëÖ Ü
$strëëá ©
+ëë™ ´
$strëë¨ µ
+ëë∂ ∑
$strëë∏ º
+ëëΩ æ
Globalsëëø ∆
.ëë∆ «!
_backupFolderPathëë« ÿ
+ëëŸ ⁄
$strëë€ ﬂ
;ëëﬂ ‡
File
ìì 
.
ìì 
WriteAllText
ìì %
(
ìì% &(
@_mongoDbBackupBatFilePath
ìì& @
,
ìì@ A
shellCmd
ììB J
)
ììJ K
;
ììK L
ProcessStartInfo
îî $#
_mongoDbBackupProcess
îî% :
=
îî; <
new
îî= @
ProcessStartInfo
îîA Q
(
îîQ R(
@_mongoDbBackupBatFilePath
îîR l
)
îîl m
{
ïï 
WindowStyle
ññ #
=
ññ$ % 
ProcessWindowStyle
ññ& 8
.
ññ8 9
Normal
ññ9 ?
,
ññ? @
UseShellExecute
óó '
=
óó( )
false
óó* /
}
òò 
;
òò 
var
öö 
dbClient
öö  
=
öö! "
new
öö# &
MongoClient
öö' 2
(
öö2 3
$str
öö3 ?
+
öö@ A
_mongoDBUserName
ööB R
+
ööS T
$str
ööU X
+
ööY Z
_mongoDBPassword
öö[ k
+
ööl m
$str
öön q
+
öör s
_mongoDbHostNameööt Ñ
+ööÖ Ü
$strööá ä
+ööã å
_mongoDbPortööç ô
+ööö õ
$strööú û
)ööû ü
;ööü †
var
õõ 
dbList
õõ 
=
õõ  
dbClient
õõ! )
.
õõ) *
ListDatabases
õõ* 7
(
õõ7 8
)
õõ8 9
.
õõ9 :
ToList
õõ: @
(
õõ@ A
)
õõA B
;
õõB C
if
úú 
(
úú 
dbList
úú 
!=
úú !
null
úú" &
&&
úú' )
dbList
úú* 0
.
úú0 1
Count
úú1 6
>
úú7 8
$num
úú9 :
)
úú: ;
{
ùù 
foreach
ûû 
(
ûû  !
var
ûû! $
item
ûû% )
in
ûû* ,
dbList
ûû- 3
)
ûû3 4
{
üü 
Console
†† #
.
††# $
	WriteLine
††$ -
(
††- .
item
††. 2
)
††2 3
;
††3 4
if
°° 
(
°°  
item
°°  $
[
°°$ %
$str
°°% +
]
°°+ ,
.
°°, -
AsString
°°- 5
==
°°6 8
Globals
°°9 @
.
°°@ A"
_mongoDbDatabaseName
°°A U
)
°°U V
{
¢¢ 
Process
§§  '
mongodbProcess
§§( 6
;
§§6 7
mongodbProcess
••  .
=
••/ 0
Process
••1 8
.
••8 9
Start
••9 >
(
••> ?#
_mongoDbBackupProcess
••? T
)
••T U
;
••U V
mongodbProcess
¶¶  .
.
¶¶. /
WaitForExit
¶¶/ :
(
¶¶: ;
)
¶¶; <
;
¶¶< =
if
ßß  "
(
ßß# $
mongodbProcess
ßß$ 2
.
ßß2 3
ExitCode
ßß3 ;
==
ßß< >
$num
ßß? @
)
ßß@ A
{
®®  !
Globals
™™$ +
.
™™+ ,'
boolMongoBackupSuccessful
™™, E
=
™™F G
true
™™H L
;
™™L M
}
´´  !
mongodbProcess
¨¨  .
.
¨¨. /
Close
¨¨/ 4
(
¨¨4 5
)
¨¨5 6
;
¨¨6 7
}
≠≠ 
}
ÆÆ 
}
ØØ 
DateTime
∞∞ #
_mongoDBBackupEndTime
∞∞ 2
=
∞∞3 4
DateTime
∞∞5 =
.
∞∞= >
Now
∞∞> A
;
∞∞A B
Globals
±± 
.
±± %
_totalMongoDBBackupTime
±± 3
=
±±4 5#
_mongoDBBackupEndTime
±±6 K
.
±±K L
Subtract
±±L T
(
±±T U%
_mongoDBBackupStartTime
±±U l
)
±±l m
;
±±m n
Console
≤≤ 
.
≤≤ 
	WriteLine
≤≤ %
(
≤≤% &
$str
≤≤& E
)
≤≤E F
;
≤≤F G
}
≥≥ 
else
¥¥ 
{
µµ *
SetServiceStatusErrorMessage
∂∂ 0
(
∂∂0 1
Globals
∂∂1 8
.
∂∂8 9!
_mongoDBServiceName
∂∂9 L
,
∂∂L M$
scMongoDBServiceStatus
∂∂N d
.
∂∂d e
Status
∂∂e k
.
∂∂k l
ToString
∂∂l t
(
∂∂t u
)
∂∂u v
)
∂∂v w
;
∂∂w x
}
∑∑ 
}
∏∏ 
catch
ππ 
(
ππ 
	Exception
ππ 
ex
ππ 
)
ππ  
{
∫∫ 
SaveErrorLog
ªª 
(
ªª 
ex
ªª 
)
ªª  
;
ªª  !
}
ºº 
}
ΩΩ 	
public
ææ 
static
ææ 
async
ææ 
Task
ææ  &
TakeElasticDBBackupAsync
ææ! 9
(
ææ9 :
)
ææ: ;
{
øø 	
try
¿¿ 
{
¡¡ 
ServiceController
¬¬ !*
scElasticSearchServiceStatus
¬¬" >
=
¬¬? @
new
¬¬A D
ServiceController
¬¬E V
(
¬¬V W
Globals
¬¬W ^
.
¬¬^ _'
_elasticsearchServiceName
¬¬_ x
)
¬¬x y
;
¬¬y z
if
ƒƒ 
(
ƒƒ *
scElasticSearchServiceStatus
ƒƒ 0
.
ƒƒ0 1
Status
ƒƒ1 7
==
ƒƒ8 :%
ServiceControllerStatus
ƒƒ; R
.
ƒƒR S
Running
ƒƒS Z
)
ƒƒZ [
{
≈≈ 
Console
∆∆ 
.
∆∆ 
	WriteLine
∆∆ %
(
∆∆% &
$str
∆∆& E
)
∆∆E F
;
∆∆F G
DateTime
«« %
_elasticBackupStartTime
«« 4
=
««5 6
DateTime
««7 ?
.
««? @
Now
««@ C
;
««C D
string
»» '
elasticCreateBackupAPIUrl
»» 4
=
»»5 6%
WebConfigurationManager
»»7 N
.
»»N O
AppSettings
»»O Z
[
»»Z [
$str
»»[ v
]
»»v w
.
»»w x
ToString»»x Ä
(»»Ä Å
)»»Å Ç
;»»Ç É
string
   
repositoryName
   )
=
  * +
string
  , 2
.
  2 3
Format
  3 9
(
  9 :
$str
  : H
,
  H I
Globals
  J Q
.
  Q R
_today
  R X
)
  X Y
;
  Y Z
string
ÀÀ 

backupName
ÀÀ %
=
ÀÀ& '
string
ÀÀ( .
.
ÀÀ. /
Format
ÀÀ/ 5
(
ÀÀ5 6
$str
ÀÀ6 D
,
ÀÀD E
Globals
ÀÀF M
.
ÀÀM N
_today
ÀÀN T
)
ÀÀT U
;
ÀÀU V
string
ÃÃ 
destDirName
ÃÃ &
=
ÃÃ' (
string
ÃÃ) /
.
ÃÃ/ 0
Format
ÃÃ0 6
(
ÃÃ6 7
$str
ÃÃ7 q
,
ÃÃq r
Globals
ÃÃs z
.
ÃÃz { 
_scanDocuFilePathÃÃ{ å
,ÃÃå ç
GlobalsÃÃé ï
.ÃÃï ñ
_todayÃÃñ ú
,ÃÃú ù
GlobalsÃÃû •
.ÃÃ• ¶
_todayÃÃ¶ ¨
,ÃÃ¨ ≠
GlobalsÃÃÆ µ
.ÃÃµ ∂
_todayÃÃ∂ º
)ÃÃº Ω
;ÃÃΩ æ!
HttpResponseMessage
ŒŒ '#
elasticBackupResponse
ŒŒ( =
=
ŒŒ> ?
BackupAPICall
ŒŒ@ M
(
ŒŒM N
Globals
ŒŒN U
.
ŒŒU V
_today
ŒŒV \
,
ŒŒ\ ]
Globals
ŒŒ^ e
.
ŒŒe f!
_elasticIndicesName
ŒŒf y
,
ŒŒy z
destDirNameŒŒ{ Ü
,ŒŒÜ á
refŒŒà ã
GlobalsŒŒå ì
.ŒŒì î 
_errorStackTraceŒŒî §
)ŒŒ§ •
;ŒŒ• ¶
if
œœ 
(
œœ #
elasticBackupResponse
œœ -
!=
œœ. 0
null
œœ1 5
&&
œœ6 8#
elasticBackupResponse
œœ9 N
.
œœN O

StatusCode
œœO Y
==
œœZ \
System
œœ] c
.
œœc d
Net
œœd g
.
œœg h
HttpStatusCode
œœh v
.
œœv w
OK
œœw y
)
œœy z
{
–– 
Globals
—— 
.
——  /
!boolElasticSearchBackupSuccessful
——  A
=
——B C
true
——D H
;
——H I
Globals
““ 
.
““   
_elasticBackupFile
““  2
=
““3 4
destDirName
““5 @
;
““@ A
}
”” 
DateTime
‘‘ #
_elasticBackupEndTime
‘‘ 2
=
‘‘3 4
DateTime
‘‘5 =
.
‘‘= >
Now
‘‘> A
;
‘‘A B
Globals
’’ 
.
’’ %
_totalElasticBackupTime
’’ 3
=
’’4 5#
_elasticBackupEndTime
’’6 K
.
’’K L
Subtract
’’L T
(
’’T U%
_elasticBackupStartTime
’’U l
)
’’l m
;
’’m n
Console
÷÷ 
.
÷÷ 
	WriteLine
÷÷ %
(
÷÷% &
$str
÷÷& G
)
÷÷G H
;
÷÷H I
}
◊◊ 
else
ÿÿ 
{
ŸŸ *
SetServiceStatusErrorMessage
⁄⁄ 0
(
⁄⁄0 1
Globals
⁄⁄1 8
.
⁄⁄8 9'
_elasticsearchServiceName
⁄⁄9 R
,
⁄⁄R S*
scElasticSearchServiceStatus
⁄⁄T p
.
⁄⁄p q
Status
⁄⁄q w
.
⁄⁄w x
ToString⁄⁄x Ä
(⁄⁄Ä Å
)⁄⁄Å Ç
)⁄⁄Ç É
;⁄⁄É Ñ
}
€€ 
}
‹‹ 
catch
›› 
(
›› 
	Exception
›› 
ex
›› 
)
››  
{
ﬁﬁ 
SaveErrorLog
ﬂﬂ 
(
ﬂﬂ 
ex
ﬂﬂ 
)
ﬂﬂ  
;
ﬂﬂ  !
}
‡‡ 
}
·· 	
public
‚‚ 
static
‚‚ 
void
‚‚ (
TakeCopyFolderOnDriveAsync
‚‚ 5
(
‚‚5 6
)
‚‚6 7
{
„„ 	
}
‰‰ 	
public
ÊÊ 
static
ÊÊ 
void
ÊÊ $
DeleteOldBackupFolders
ÊÊ 1
(
ÊÊ1 2
string
ÊÊ2 8
pBackupPath
ÊÊ9 D
,
ÊÊD E
int
ÊÊF I
pOldBackupDays
ÊÊJ X
,
ÊÊX Y
ref
ÊÊZ ]
string
ÊÊ^ d
_errorStackTrace
ÊÊe u
)
ÊÊu v
{
ÁÁ 	
var
ËË 
deleteFilePath
ËË 
=
ËË  
string
ËË! '
.
ËË' (
Empty
ËË( -
;
ËË- .
try
ÈÈ 
{
ÍÍ 
if
ÎÎ 
(
ÎÎ 
	Directory
ÎÎ 
.
ÎÎ 
Exists
ÎÎ $
(
ÎÎ$ %
pBackupPath
ÎÎ% 0
)
ÎÎ0 1
)
ÎÎ1 2
{
ÏÏ 
DirectoryInfo
ÌÌ !
dir
ÌÌ" %
=
ÌÌ& '
new
ÌÌ( +
DirectoryInfo
ÌÌ, 9
(
ÌÌ9 :
pBackupPath
ÌÌ: E
)
ÌÌE F
;
ÌÌF G
var
ÓÓ 
dirTemp
ÓÓ 
=
ÓÓ  !
dir
ÓÓ" %
.
ÓÓ% &
GetDirectories
ÓÓ& 4
(
ÓÓ4 5
)
ÓÓ5 6
;
ÓÓ6 7
foreach
ÔÔ 
(
ÔÔ 
var
ÔÔ  
dirInfo
ÔÔ! (
in
ÔÔ) +
dirTemp
ÔÔ, 3
)
ÔÔ3 4
{
 
TimeSpan
ÒÒ  

difference
ÒÒ! +
=
ÒÒ, -
DateTime
ÒÒ. 6
.
ÒÒ6 7
Now
ÒÒ7 :
-
ÒÒ; <
dirInfo
ÒÒ= D
.
ÒÒD E
CreationTime
ÒÒE Q
;
ÒÒQ R
if
ÚÚ 
(
ÚÚ 

difference
ÚÚ &
.
ÚÚ& '
Days
ÚÚ' +
>
ÚÚ, -
pOldBackupDays
ÚÚ. <
)
ÚÚ< =
{
ÛÛ 
deleteFilePath
ÙÙ *
=
ÙÙ+ ,
dirInfo
ÙÙ- 4
.
ÙÙ4 5
FullName
ÙÙ5 =
;
ÙÙ= >
	Directory
ıı %
.
ıı% &
Delete
ıı& ,
(
ıı, -
dirInfo
ıı- 4
.
ıı4 5
FullName
ıı5 =
,
ıı= >
true
ıı? C
)
ııC D
;
ııD E
}
ˆˆ 
}
˜˜ 
}
¯¯ 
}
˘˘ 
catch
˙˙ 
(
˙˙ 
	Exception
˙˙ 
ex
˙˙ 
)
˙˙  
{
˚˚ 
SaveErrorLog
¸¸ 
(
¸¸ 
ex
¸¸ 
)
¸¸  
;
¸¸  !
_errorStackTrace
˝˝  
+=
˝˝! #
string
˝˝$ *
.
˝˝* +
Format
˝˝+ 1
(
˝˝1 2
$str
˝˝2 Q
,
˝˝Q R
deleteFilePath
˝˝S a
,
˝˝a b
ex
˝˝c e
.
˝˝e f
Message
˝˝f m
,
˝˝m n
ex
˝˝o q
.
˝˝q r

StackTrace
˝˝r |
)
˝˝| }
;
˝˝} ~
}
˛˛ 
}
ˇˇ 	
public
ÅÅ 
static
ÅÅ 
string
ÅÅ 
GetConvertedSize
ÅÅ -
(
ÅÅ- .
double
ÅÅ. 4
sizeInMB
ÅÅ5 =
)
ÅÅ= >
{
ÇÇ 	
if
ÉÉ 
(
ÉÉ 
sizeInMB
ÉÉ 
>=
ÉÉ 
$num
ÉÉ  
)
ÉÉ  !
{
ÑÑ 
return
ÖÖ 
Math
ÖÖ 
.
ÖÖ 
Round
ÖÖ !
(
ÖÖ! "
(
ÖÖ" #
sizeInMB
ÖÖ# +
/
ÖÖ, -
$num
ÖÖ. 2
)
ÖÖ2 3
,
ÖÖ3 4
$num
ÖÖ5 6
)
ÖÖ6 7
+
ÖÖ8 9
$str
ÖÖ: ?
;
ÖÖ? @
}
ÜÜ 
else
áá 
{
àà 
return
ââ 
Math
ââ 
.
ââ 
Round
ââ !
(
ââ! "
(
ââ" #
sizeInMB
ââ# +
>
ââ, -
$num
ââ. /
?
ââ0 1
sizeInMB
ââ2 :
:
ââ; <
$num
ââ= >
)
ââ> ?
,
ââ? @
$num
ââA B
)
ââB C
+
ââD E
$str
ââF K
;
ââK L
}
ää 
}
ãã 	
public
çç 
static
çç 
void
çç 
SaveErrorLog
çç '
(
çç' (
	Exception
çç( 1
ex
çç2 4
)
çç4 5
{
éé 	
try
èè 
{
êê 
string
ëë 
_ErrorLogFilePath
ëë (
=
ëë) *%
WebConfigurationManager
ëë+ B
.
ëëB C
AppSettings
ëëC N
[
ëëN O
$str
ëëO a
]
ëëa b
.
ëëb c
ToString
ëëc k
(
ëëk l
)
ëël m
;
ëëm n
string
ìì 

strLogText
ìì !
=
ìì" #
ex
ìì$ &
.
ìì& '
Message
ìì' .
.
ìì. /
ToString
ìì/ 7
(
ìì7 8
)
ìì8 9
;
ìì9 :
if
îî 
(
îî 
ex
îî 
.
îî 

StackTrace
îî !
!=
îî" $
null
îî% )
)
îî) *
{
ïï 

strLogText
ññ 
=
ññ  

strLogText
ññ! +
+
ññ, -
$str
ññ. 0
+
ññ1 2
ex
ññ3 5
.
ññ5 6

StackTrace
ññ6 @
.
ññ@ A
ToString
ññA I
(
ññI J
)
ññJ K
;
ññK L
}
óó 
StreamWriter
öö 
log
öö  
;
öö  !
if
úú 
(
úú 
!
úú 
File
úú 
.
úú 
Exists
úú  
(
úú  !
_ErrorLogFilePath
úú! 2
)
úú2 3
)
úú3 4
{
ùù 
log
ûû 
=
ûû 
new
ûû 
StreamWriter
ûû *
(
ûû* +
_ErrorLogFilePath
ûû+ <
)
ûû< =
;
ûû= >
}
üü 
else
†† 
{
°° 
log
¢¢ 
=
¢¢ 
File
¢¢ 
.
¢¢ 

AppendText
¢¢ )
(
¢¢) *
_ErrorLogFilePath
¢¢* ;
)
¢¢; <
;
¢¢< =
}
££ 
log
¶¶ 
.
¶¶ 
	WriteLine
¶¶ 
(
¶¶ 
DateTime
¶¶ &
.
¶¶& '
Now
¶¶' *
)
¶¶* +
;
¶¶+ ,
log
ßß 
.
ßß 
	WriteLine
ßß 
(
ßß 

strLogText
ßß (
)
ßß( )
;
ßß) *
log
®® 
.
®® 
	WriteLine
®® 
(
®® 
)
®® 
;
®®  
log
´´ 
.
´´ 
Close
´´ 
(
´´ 
)
´´ 
;
´´ 
}
¨¨ 
catch
≠≠ 
(
≠≠ 
	Exception
≠≠ 
)
≠≠ 
{
ÆÆ 
}
∞∞ 
}
±± 	
private
≥≥ 
static
≥≥ !
HttpResponseMessage
≥≥ *
BackupAPICall
≥≥+ 8
(
≥≥8 9
DateTime
≥≥9 A
_today
≥≥B H
,
≥≥H I
string
≥≥J P 
elasticIndicesName
≥≥Q c
,
≥≥c d
string
≥≥e k
destDirName
≥≥l w
,
≥≥w x
ref
≥≥y |
string≥≥} É 
_errorStackTrace≥≥Ñ î
)≥≥î ï
{
¥¥ 	
string
µµ '
elasticCreateBackupAPIUrl
µµ ,
=
µµ- .%
WebConfigurationManager
µµ/ F
.
µµF G
AppSettings
µµG R
[
µµR S
$str
µµS n
]
µµn o
.
µµo p
ToString
µµp x
(
µµx y
)
µµy z
;
µµz {
string
∑∑ 
publishMode
∑∑ 
=
∑∑  %
WebConfigurationManager
∑∑! 8
.
∑∑8 9
AppSettings
∑∑9 D
[
∑∑D E
$str
∑∑E R
]
∑∑R S
.
∑∑S T
ToString
∑∑T \
(
∑∑\ ]
)
∑∑] ^
;
∑∑^ _
string
ππ 
repositoryName
ππ !
=
ππ" #
publishMode
ππ$ /
+
ππ0 1
string
ππ2 8
.
ππ8 9
Format
ππ9 ?
(
ππ? @
$str
ππ@ T
,
ππT U
_today
ππV \
)
ππ\ ]
;
ππ] ^
string
∫∫ 

backupName
∫∫ 
=
∫∫ 
publishMode
∫∫  +
+
∫∫, -
string
∫∫. 4
.
∫∫4 5
Format
∫∫5 ;
(
∫∫; <
$str
∫∫< P
,
∫∫P Q
_today
∫∫R X
)
∫∫X Y
;
∫∫Y Z

HttpClient
ªª 
client
ªª 
=
ªª 
new
ªª  #

HttpClient
ªª$ .
(
ªª. /
)
ªª/ 0
;
ªª0 1
var
ºº 
backupModel
ºº 
=
ºº 
new
ºº !
{
ΩΩ 
IndicesName
ææ 
=
ææ  
elasticIndicesName
ææ 0
,
ææ0 1
RepositoryName
øø 
=
øø  
repositoryName
øø! /
,
øø/ 0

BackupName
¿¿ 
=
¿¿ 

backupName
¿¿ '
,
¿¿' (
BackupFolderName
¡¡  
=
¡¡! "

backupName
¡¡# -
}
¬¬ 
;
¬¬ 
var
√√ 
dataAsString
√√ 
=
√√ 
JsonConvert
√√ *
.
√√* +
SerializeObject
√√+ :
(
√√: ;
backupModel
√√; F
)
√√F G
;
√√G H
var
ƒƒ 
content
ƒƒ 
=
ƒƒ 
new
ƒƒ 
StringContent
ƒƒ +
(
ƒƒ+ ,
dataAsString
ƒƒ, 8
)
ƒƒ8 9
;
ƒƒ9 :
content
≈≈ 
.
≈≈ 
Headers
≈≈ 
.
≈≈ 
ContentType
≈≈ '
=
≈≈( )
new
≈≈* -"
MediaTypeHeaderValue
≈≈. B
(
≈≈B C
$str
≈≈C U
)
≈≈U V
;
≈≈V W
var
∆∆ 
response
∆∆ 
=
∆∆ 
client
∆∆ !
.
∆∆! "
	PostAsync
∆∆" +
(
∆∆+ ,'
elasticCreateBackupAPIUrl
∆∆, E
,
∆∆E F
content
∆∆G N
)
∆∆N O
.
∆∆O P
Result
∆∆P V
;
∆∆V W
if
«« 
(
«« 
response
«« 
!=
«« 
null
««  
)
««  !
{
»» 
Console
…… 
.
…… 
	WriteLine
…… !
(
……! "
$str
……" <
+
……= >
response
……? G
.
……G H
Content
……H O
.
……O P
ReadAsStringAsync
……P a
(
……a b
)
……b c
.
……c d
Result
……d j
)
……j k
;
……k l
}
   
var
ÀÀ 
elasticBackUpPath
ÀÀ !
=
ÀÀ" #%
WebConfigurationManager
ÀÀ$ ;
.
ÀÀ; <
AppSettings
ÀÀ< G
[
ÀÀG H
$str
ÀÀH [
]
ÀÀ[ \
.
ÀÀ\ ]
ToString
ÀÀ] e
(
ÀÀe f
)
ÀÀf g
;
ÀÀg h
var
ÕÕ 
sourceDirName
ÕÕ 
=
ÕÕ 
elasticBackUpPath
ÕÕ  1
+
ÕÕ2 3

backupName
ÕÕ4 >
;
ÕÕ> ?
var
–– (
timeoutForCopyBackupFolder
–– *
=
––+ ,%
WebConfigurationManager
––- D
.
––D E
AppSettings
––E P
[
––P Q
$str
––Q m
]
––m n
.
––n o
ToString
––o w
(
––w x
)
––x y
;
––y z
Thread
““ 
.
““ 
Sleep
““ 
(
““ 
int
““ 
.
““ 
Parse
““ "
(
““" #(
timeoutForCopyBackupFolder
““# =
)
““= >
)
““> ?
;
““? @
DirectoryCopy
”” 
(
”” 
sourceDirName
”” '
,
””' (
destDirName
””) 4
,
””4 5
true
””6 :
,
””: ;
ref
””< ?
_errorStackTrace
””@ P
)
””P Q
;
””Q R
try
‘‘ 
{
’’ 
foreach
÷÷ 
(
÷÷ 
string
÷÷ 
folder
÷÷  &
in
÷÷' )
	Directory
÷÷* 3
.
÷÷3 4
GetDirectories
÷÷4 B
(
÷÷B C
sourceDirName
÷÷C P
)
÷÷P Q
)
÷÷Q R
{
◊◊ 
	Directory
ÿÿ 
.
ÿÿ 
Delete
ÿÿ $
(
ÿÿ$ %
folder
ÿÿ% +
,
ÿÿ+ ,
true
ÿÿ- 1
)
ÿÿ1 2
;
ÿÿ2 3
}
ŸŸ 
	Directory
⁄⁄ 
.
⁄⁄ 
Delete
⁄⁄  
(
⁄⁄  !
sourceDirName
⁄⁄! .
,
⁄⁄. /
true
⁄⁄0 4
)
⁄⁄4 5
;
⁄⁄5 6
}
€€ 
catch
‹‹ 
(
‹‹ 
	Exception
‹‹ 
ex
‹‹ 
)
‹‹  
{
›› 
SaveErrorLog
ﬁﬁ 
(
ﬁﬁ 
ex
ﬁﬁ 
)
ﬁﬁ  
;
ﬁﬁ  !
}
ﬂﬂ 
;
ﬂﬂ 
return
‡‡ 
response
‡‡ 
;
‡‡ 
}
·· 	
private
„„ 
static
„„ 
Boolean
„„ 
BackUpFolderCopy
„„ /
(
„„/ 0
string
„„0 6
_psFilePath
„„7 B
,
„„B C
string
„„D J%
_uploadFolderBackupFile
„„K b
,
„„b c
DateTime
„„d l
_today
„„m s
,
„„s t
ref
„„u x
string
„„y  
_errorStackTrace„„Ä ê
)„„ê ë
{
‰‰ 	
try
ÂÂ 
{
ÊÊ 
DirectoryCopy
ÁÁ 
(
ÁÁ 
_psFilePath
ÁÁ )
,
ÁÁ) *%
_uploadFolderBackupFile
ÁÁ+ B
,
ÁÁB C
true
ÁÁD H
,
ÁÁH I
ref
ÁÁJ M
_errorStackTrace
ÁÁN ^
)
ÁÁ^ _
;
ÁÁ_ `
return
ËË 
true
ËË 
;
ËË 
}
ÈÈ 
catch
ÍÍ 
(
ÍÍ 
	Exception
ÍÍ 
ex
ÍÍ 
)
ÍÍ  
{
ÎÎ 
SaveErrorLog
ÏÏ 
(
ÏÏ 
ex
ÏÏ 
)
ÏÏ  
;
ÏÏ  !
return
ÌÌ 
false
ÌÌ 
;
ÌÌ 
}
ÓÓ 
}
ÔÔ 	
private
ÒÒ 
static
ÒÒ 
void
ÒÒ 
DirectoryCopy
ÒÒ )
(
ÒÒ) *
string
ÒÒ* 0
sourceDirName
ÒÒ1 >
,
ÒÒ> ?
string
ÒÒ@ F
destDirName
ÒÒG R
,
ÒÒR S
bool
ÒÒT X
copySubDirs
ÒÒY d
,
ÒÒd e
ref
ÒÒf i
string
ÒÒj p
_errorStackTraceÒÒq Å
)ÒÒÅ Ç
{
ÚÚ 	
try
ÛÛ 
{
ÙÙ 
DirectoryInfo
ˆˆ 
dir
ˆˆ !
=
ˆˆ" #
new
ˆˆ$ '
DirectoryInfo
ˆˆ( 5
(
ˆˆ5 6
sourceDirName
ˆˆ6 C
)
ˆˆC D
;
ˆˆD E
if
¯¯ 
(
¯¯ 
!
¯¯ 
dir
¯¯ 
.
¯¯ 
Exists
¯¯ 
)
¯¯  
{
˘˘ 
throw
˙˙ 
new
˙˙ (
DirectoryNotFoundException
˙˙ 8
(
˙˙8 9
$str
˚˚ Q
+
¸¸ 
sourceDirName
¸¸ '
)
¸¸' (
;
¸¸( )
}
˝˝ 
DirectoryInfo
˛˛ 
[
˛˛ 
]
˛˛ 
dirs
˛˛  $
=
˛˛% &
dir
˛˛' *
.
˛˛* +
GetDirectories
˛˛+ 9
(
˛˛9 :
)
˛˛: ;
;
˛˛; <
if
ÄÄ 
(
ÄÄ 
!
ÄÄ 
	Directory
ÄÄ 
.
ÄÄ 
Exists
ÄÄ %
(
ÄÄ% &
destDirName
ÄÄ& 1
)
ÄÄ1 2
)
ÄÄ2 3
{
ÅÅ 
	Directory
ÇÇ 
.
ÇÇ 
CreateDirectory
ÇÇ -
(
ÇÇ- .
destDirName
ÇÇ. 9
)
ÇÇ9 :
;
ÇÇ: ;
}
ÉÉ 
FileInfo
ÜÜ 
[
ÜÜ 
]
ÜÜ 
files
ÜÜ  
=
ÜÜ! "
dir
ÜÜ# &
.
ÜÜ& '
GetFiles
ÜÜ' /
(
ÜÜ/ 0
)
ÜÜ0 1
;
ÜÜ1 2
foreach
áá 
(
áá 
FileInfo
áá !
file
áá" &
in
áá' )
files
áá* /
)
áá/ 0
{
àà 
string
ââ 
temppath
ââ #
=
ââ$ %
Path
ââ& *
.
ââ* +
Combine
ââ+ 2
(
ââ2 3
destDirName
ââ3 >
,
ââ> ?
file
ââ@ D
.
ââD E
Name
ââE I
)
ââI J
;
ââJ K
file
ää 
.
ää 
CopyTo
ää 
(
ää  
temppath
ää  (
,
ää( )
false
ää* /
)
ää/ 0
;
ää0 1
}
ãã 
if
éé 
(
éé 
copySubDirs
éé 
)
éé  
{
èè 
foreach
êê 
(
êê 
DirectoryInfo
êê *
subdir
êê+ 1
in
êê2 4
dirs
êê5 9
)
êê9 :
{
ëë 
string
íí 
temppath
íí '
=
íí( )
Path
íí* .
.
íí. /
Combine
íí/ 6
(
íí6 7
destDirName
íí7 B
,
ííB C
subdir
ííD J
.
ííJ K
Name
ííK O
)
ííO P
;
ííP Q
DirectoryCopy
ìì %
(
ìì% &
subdir
ìì& ,
.
ìì, -
FullName
ìì- 5
,
ìì5 6
temppath
ìì7 ?
,
ìì? @
copySubDirs
ììA L
,
ììL M
ref
ììN Q
_errorStackTrace
ììR b
)
ììb c
;
ììc d
}
îî 
}
ïï 
}
ññ 
catch
óó 
(
óó 
	Exception
óó 
ex
óó 
)
óó  
{
òò 
SaveErrorLog
ôô 
(
ôô 
ex
ôô 
)
ôô  
;
ôô  !
_errorStackTrace
öö  
=
öö! "
_errorStackTrace
öö# 3
+
öö4 5
string
öö6 <
.
öö< =
Format
öö= C
(
ööC D
$str
ööD [
,
öö[ \
ex
öö] _
.
öö_ `
Message
öö` g
,
öög h
ex
ööi k
.
öök l

StackTrace
ööl v
)
ööv w
;
ööw x
}
õõ 
}
úú 	
private
†† 
static
†† 
string
†† 
GetTimeInText
†† +
(
††+ ,
TimeSpan
††, 4
time
††5 9
)
††9 :
{
°° 	
string
¢¢ 
_timeSuffix
¢¢ 
=
¢¢  
$str
¢¢! #
;
¢¢# $
if
££ 
(
££ 
time
££ 
!=
££ 
null
££ 
)
££ 
{
§§ 
_timeSuffix
•• 
+=
•• 
time
•• #
.
••# $
Hours
••$ )
>
••* +
$num
••, -
?
••. /
(
••0 1
time
••1 5
.
••5 6
Hours
••6 ;
.
••; <
ToString
••< D
(
••D E
)
••E F
+
••G H
$str
••I R
)
••R S
:
••T U
$str
••V X
;
••X Y
_timeSuffix
¶¶ 
+=
¶¶ 
time
¶¶ #
.
¶¶# $
Minutes
¶¶$ +
>
¶¶, -
$num
¶¶. /
?
¶¶0 1
(
¶¶2 3
time
¶¶3 7
.
¶¶7 8
Minutes
¶¶8 ?
.
¶¶? @
ToString
¶¶@ H
(
¶¶H I
)
¶¶I J
+
¶¶K L
$str
¶¶M X
)
¶¶X Y
:
¶¶Z [
$str
¶¶\ ^
;
¶¶^ _
_timeSuffix
ßß 
+=
ßß 
time
ßß #
.
ßß# $
Seconds
ßß$ +
>
ßß, -
$num
ßß. /
?
ßß0 1
(
ßß2 3
time
ßß3 7
.
ßß7 8
Seconds
ßß8 ?
.
ßß? @
ToString
ßß@ H
(
ßßH I
)
ßßI J
+
ßßK L
$str
ßßM X
)
ßßX Y
:
ßßZ [
$str
ßß\ ^
;
ßß^ _
}
®® 
return
©© 
_timeSuffix
©© 
;
©© 
}
™™ 	
private
ÆÆ 
static
ÆÆ 
double
ÆÆ 
GetDirectorySize
ÆÆ .
(
ÆÆ. /
string
ÆÆ/ 5
path
ÆÆ6 :
)
ÆÆ: ;
{
ØØ 	
long
∞∞ 
size
∞∞ 
=
∞∞ 
$num
∞∞ 
;
∞∞ 
var
±± 
dirInfo
±± 
=
±± 
new
±± 
DirectoryInfo
±± +
(
±±+ ,
path
±±, 0
)
±±0 1
;
±±1 2
if
≤≤ 
(
≤≤ 
dirInfo
≤≤ 
.
≤≤ 
Exists
≤≤ 
)
≤≤ 
{
≥≥ 
foreach
¥¥ 
(
¥¥ 
FileInfo
¥¥ !
fi
¥¥" $
in
¥¥% '
dirInfo
¥¥( /
.
¥¥/ 0
GetFiles
¥¥0 8
(
¥¥8 9
$str
¥¥9 <
,
¥¥< =
SearchOption
¥¥> J
.
¥¥J K
AllDirectories
¥¥K Y
)
¥¥Y Z
)
¥¥Z [
{
µµ 
size
∂∂ 
+=
∂∂ 
fi
∂∂ 
.
∂∂ 
Length
∂∂ %
;
∂∂% &
}
∑∑ 
}
∏∏ 
return
ππ 
Math
ππ 
.
ππ 
Round
ππ 
(
ππ 
(
ππ 
(
ππ  
double
ππ  &
)
ππ& '
size
ππ' +
/
ππ, -
$num
ππ. 2
/
ππ3 4
$num
ππ5 9
)
ππ9 :
,
ππ: ;
$num
ππ< =
)
ππ= >
;
ππ> ?
}
∫∫ 	
public
ºº 
static
ºº 
string
ºº 
GetLocalIPAddress
ºº .
(
ºº. /
)
ºº/ 0
{
ΩΩ 	
var
ææ 
host
ææ 
=
ææ 
Dns
ææ 
.
ææ 
GetHostEntry
ææ '
(
ææ' (
Dns
ææ( +
.
ææ+ ,
GetHostName
ææ, 7
(
ææ7 8
)
ææ8 9
)
ææ9 :
;
ææ: ;
foreach
øø 
(
øø 
var
øø 
ip
øø 
in
øø 
host
øø #
.
øø# $
AddressList
øø$ /
)
øø/ 0
{
¿¿ 
if
¡¡ 
(
¡¡ 
ip
¡¡ 
.
¡¡ 
AddressFamily
¡¡ $
==
¡¡% '
AddressFamily
¡¡( 5
.
¡¡5 6
InterNetwork
¡¡6 B
)
¡¡B C
{
¬¬ 
return
√√ 
ip
√√ 
.
√√ 
ToString
√√ &
(
√√& '
)
√√' (
;
√√( )
}
ƒƒ 
}
≈≈ 
throw
∆∆ 
new
∆∆ 
	Exception
∆∆ 
(
∆∆  
$str
∆∆  Y
)
∆∆Y Z
;
∆∆Z [
}
«« 	
public
…… 
static
…… 
void
…… 0
"CompressToZipFileAndDeleteOriginal
…… =
(
……= >
string
……> D
pathWithFileName
……E U
)
……U V
{
   	
try
ÀÀ 
{
ÃÃ 
string
ÕÕ 
sZipped
ÕÕ 
=
ÕÕ  
pathWithFileName
ÕÕ! 1
+
ÕÕ2 3
Globals
ÕÕ4 ;
.
ÕÕ; <&
_compressedFileExtension
ÕÕ< T
;
ÕÕT U
ProcessStartInfo
——  
p
——! "
=
——# $
new
——% (
ProcessStartInfo
——) 9
{
““ 
FileName
”” 
=
”” 
Globals
”” &
.
””& '
_7ZipExeFilePath
””' 7
,
””7 8
	Arguments
⁄⁄ 
=
⁄⁄ 
$str
⁄⁄  +
+
⁄⁄, -
sZipped
⁄⁄. 5
+
⁄⁄6 7
$str
⁄⁄8 ?
+
⁄⁄@ A
pathWithFileName
⁄⁄B R
,
⁄⁄R S
WindowStyle
€€ 
=
€€  ! 
ProcessWindowStyle
€€" 4
.
€€4 5
Hidden
€€5 ;
}
‹‹ 
;
‹‹ 
Process
·· 
x
·· 
=
·· 
Process
·· #
.
··# $
Start
··$ )
(
··) *
p
··* +
)
··+ ,
;
··, -
x
‚‚ 
.
‚‚ 
WaitForExit
‚‚ 
(
‚‚ 
)
‚‚ 
;
‚‚  
File
„„ 
.
„„ 
Delete
„„ 
(
„„ 
pathWithFileName
„„ ,
)
„„, -
;
„„- .
}
‰‰ 
catch
ÂÂ 
(
ÂÂ 
	Exception
ÂÂ 
ex
ÂÂ 
)
ÂÂ  
{
ÊÊ 
SaveErrorLog
ÁÁ 
(
ÁÁ 
ex
ÁÁ 
)
ÁÁ  
;
ÁÁ  !
}
ËË 
}
ÈÈ 	
}
ÍÍ 
}ÎÎ Ô
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