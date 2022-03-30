Â
ID:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Email Service\EmailModel.cs
	namespace 	
FJT
 
. 
ServiceUtility 
. 
Email_Service *
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
} Ç
KD:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Email Service\EmailService.cs
	namespace 	
FJT
 
. 
ServiceUtility 
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
void !
commonSendEmailDetail )
() *

EmailModel* 4
	emailData5 >
)> ?
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
;!!. /
	emailData"" 
.""  
mailSendProviderType"" *
=""+ ,
$str""- 6
;""6 7
string## 
	jsonified## 
=## 
JsonConvert## *
.##* +
SerializeObject##+ :
(##: ;
	emailData##; D
)##D E
;##E F
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
})) ˜
MD:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Email Service\ResponseResult.cs
	namespace 	
FJT
 
. 
ServiceUtility 
. 
Email_Service *
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
} ¶ğ
8D:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Program.cs
	namespace 	
FJT
 
. 
ServiceUtility 
{ 
class 	
Program
 
{ 
static 
string 
_adminEmailID #
=$ %#
WebConfigurationManager& =
.= >
AppSettings> I
[I J
$strJ X
]X Y
.Y Z
ToStringZ b
(b c
)c d
;d e
static 
bool 

isLocalEnv 
=  
bool! %
.% &
Parse& +
(+ ,#
WebConfigurationManager, C
.C D
AppSettingsD O
[O P
$strP d
]d e
.e f
ToStringf n
(n o
)o p
)p q
;q r
static 
int 
_sleepTimeInSec "
=# $
int% (
.( )
Parse) .
(. /#
WebConfigurationManager/ F
.F G
AppSettingsG R
[R S
$strS c
]c d
)d e
;e f
static 
int 
	_tryCount 
= 
int "
." #
Parse# (
(( )#
WebConfigurationManager) @
.@ A
AppSettingsA L
[L M
$strM W
]W X
)X Y
;Y Z
public 
static 
class 
Globals #
{ 	
public 
static 
string  
_systemDetails! /
=0 1#
WebConfigurationManager2 I
.I J
AppSettingsJ U
[U V
$strV e
]e f
.f g
ToStringg o
(o p
)p q
;q r
public 
static 
string  
_baseUrl! )
=* +#
WebConfigurationManager, C
.C D
AppSettingsD O
[O P
$strP \
]\ ]
.] ^
ToString^ f
(f g
)g h
;h i
public 
static 
string  
_apiUrl! (
=) *#
WebConfigurationManager+ B
.B C
AppSettingsC N
[N O
$strO W
]W X
.X Y
ToStringY a
(a b
)b c
;c d
public   
static   
string    
_reportingUrl  ! .
=  / 0#
WebConfigurationManager  1 H
.  H I
AppSettings  I T
[  T U
$str  U c
]  c d
.  d e
ToString  e m
(  m n
)  n o
;  o p
public!! 
static!! 
string!!  
_reportDesignerUrl!!! 3
=!!4 5#
WebConfigurationManager!!6 M
.!!M N
AppSettings!!N Y
[!!Y Z
$str!!Z m
]!!m n
.!!n o
ToString!!o w
(!!w x
)!!x y
;!!y z
public"" 
static"" 
string""  
_reportViewerUrl""! 1
=""2 3#
WebConfigurationManager""4 K
.""K L
AppSettings""L W
[""W X
$str""X i
]""i j
.""j k
ToString""k s
(""s t
)""t u
;""u v
public## 
static## 
string##  
_identityUrl##! -
=##. /#
WebConfigurationManager##0 G
.##G H
AppSettings##H S
[##S T
$str##T a
]##a b
.##b c
ToString##c k
(##k l
)##l m
;##m n
public$$ 
static$$ 
string$$  
_enterpriseUrl$$! /
=$$0 1#
WebConfigurationManager$$2 I
.$$I J
AppSettings$$J U
[$$U V
$str$$V k
]$$k l
.$$l m
ToString$$m u
($$u v
)$$v w
;$$w x
public%% 
static%% 
string%%  
_mySQLServiceName%%! 2
=%%3 4#
WebConfigurationManager%%5 L
.%%L M
AppSettings%%M X
[%%X Y
$str%%Y k
]%%k l
.%%l m
ToString%%m u
(%%u v
)%%v w
;%%w x
public&& 
static&& 
string&&   
_mySQLDevServiceName&&! 5
=&&6 7#
WebConfigurationManager&&8 O
.&&O P
AppSettings&&P [
[&&[ \
$str&&\ q
]&&q r
.&&r s
ToString&&s {
(&&{ |
)&&| }
;&&} ~
public'' 
static'' 
string''  
_mongoDBServiceName''! 4
=''5 6#
WebConfigurationManager''7 N
.''N O
AppSettings''O Z
[''Z [
$str''[ o
]''o p
.''p q
ToString''q y
(''y z
)''z {
;''{ |
public(( 
static(( 
string((   
_rabbitMQServiceName((! 5
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
string))  %
_elasticSearchServiceName))! :
=)); <#
WebConfigurationManager))= T
.))T U
AppSettings))U `
[))` a
$str))a {
])){ |
.))| }
ToString	))} …
(
))… †
)
))† ‡
;
))‡ ˆ
public** 
static** 
string**  "
_q2CPricingServiceName**! 7
=**8 9#
WebConfigurationManager**: Q
.**Q R
AppSettings**R ]
[**] ^
$str**^ u
]**u v
.**v w
ToString**w 
(	** €
)
**€ 
;
** ‚
public++ 
static++ 
string++   
_q2CEmailServiceName++! 5
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
string,,  '
_q2CSearchEngineServiceName,,! <
=,,= >#
WebConfigurationManager,,? V
.,,V W
AppSettings,,W b
[,,b c
$str,,c 
]	,, €
.
,,€ 
ToString
,, ‰
(
,,‰ Š
)
,,Š ‹
;
,,‹ Œ
public-- 
static-- 
string--   
_powerShellScriptExe--! 5
=--6 7#
WebConfigurationManager--8 O
.--O P
AppSettings--P [
[--[ \
$str--\ q
]--q r
.--r s
ToString--s {
(--{ |
)--| }
;--} ~
public.. 
static.. 
string..  %
_powerShellScriptFilePath..! :
=..; <#
WebConfigurationManager..= T
...T U
AppSettings..U `
[..` a
$str..a {
]..{ |
...| }
ToString	..} …
(
..… †
)
..† ‡
;
..‡ ˆ
public00 
static00 
string00  
[00  !
]00! " 
_primaryServiceNames00# 7
=008 9
{00: ;
_mySQLServiceName00< M
,00M N 
_mySQLDevServiceName00O c
,00c d
_mongoDBServiceName00e x
,00x y!
_rabbitMQServiceName	00z 
,
00 '
_elasticSearchServiceName
00 ©
}
00ª «
;
00« ¬
public11 
static11 
string11  
[11  !
]11! ""
_secondaryServiceNames11# 9
=11: ;
{11< ="
_q2CPricingServiceName11> T
,11T U 
_q2CEmailServiceName11V j
,11j k(
_q2CSearchEngineServiceName	11l ‡
}
11ˆ ‰
;
11‰ Š
public22 
static22 
bool22 
IsAPIProjectRunning22 2
,222 3
IsUIProjectRunning224 F
,22F G%
IsReportingProjectRunning22H a
,22a b+
IsReportDesignerProjectRunning	22c 
,
22 ‚*
IsReportViewerProjectRunning
22ƒ Ÿ
,
22Ÿ  ,
IsIdentityServerProjectRunning
22¡ ¿
,
22¿ À1
#IsEnterpriseSearchAPIProjectRunning
22Á ä
=
22å æ
false
22ç ì
;
22ì í
public33 
static33 
bool33 !
IsMySQLServiceRunning33 4
,334 5$
IsMySQLDevServiceRunning336 N
,33N O#
IsMongoDBServiceRunning33P g
,33g h%
IsRabbitMQServiceRunning	33i 
,
33 ‚%
IsElasticServiceRunning
33ƒ š
=
33› œ
false
33 ¢
;
33¢ £
public44 
static44 
bool44 ,
 IsEnterpriseSearchServiceRunning44 ?
,44? @!
IsEmailServiceRunning44A V
,44V W#
IsPricingServiceRunning44X o
=44p q
false44r w
;44w x
public55 
static55 
string55  
	_bodyText55! *
,55* +
_errorStackTrace55, <
=55= >
$str55? A
;55A B
}66 	
static77 
async77 
Task77 
Main77 
(77 
string77 %
[77% &
]77& '
args77( ,
)77, -
{88 	
if99 
(99 

isLocalEnv99 
)99 
{:: 
ServicePointManager;; #
.;;# $/
#ServerCertificateValidationCallback;;$ G
=;;H I
delegate;;J R
{;;S T
return;;U [
true;;\ `
;;;` a
};;b c
;;;c d
}<< 
try== 
{>> 
ifAA 
(AA 
GlobalsAA 
.AA  
_primaryServiceNamesAA 0
.AA0 1
LengthAA1 7
>AA8 9
$numAA: ;
)AA; <
{BB 
foreachCC 
(CC 
stringCC #
serviceCC$ +
inCC, .
GlobalsCC/ 6
.CC6 7 
_primaryServiceNamesCC7 K
)CCK L
{DD 
ifEE 
(EE 
!EE 
stringEE #
.EE# $
IsNullOrEmptyEE$ 1
(EE1 2
serviceEE2 9
)EE9 :
)EE: ;
CheckServiceStatusFF .
(FF. /
serviceFF/ 6
)FF6 7
;FF7 8
}GG 
}HH 
CheckAllAPIStatusJJ !
(JJ! "
)JJ" #
;JJ# $
ConsoleLL 
.LL 
	WriteLineLL !
(LL! "
$strLL" 8
)LL8 9
;LL9 :
}MM 
catchNN 
(NN 
	ExceptionNN 
exNN 
)NN  
{OO 
GlobalsPP 
.PP 
_errorStackTracePP (
+=PP) +
stringPP, 2
.PP2 3
FormatPP3 9
(PP9 :
$strPP: Q
,PPQ R
exPPS U
.PPU V
MessagePPV ]
,PP] ^
exPP_ a
.PPa b

StackTracePPb l
)PPl m
;PPm n
SaveErrorLogQQ 
(QQ 
exQQ 
)QQ  
;QQ  !
}RR 
finallySS 
{TT 
ifWW 
(WW 
GlobalsWW 
.WW "
_secondaryServiceNamesWW 2
.WW2 3
LengthWW3 9
>WW: ;
$numWW< =
)WW= >
{XX 
foreachYY 
(YY 
stringYY #
serviceYY$ +
inYY, .
GlobalsYY/ 6
.YY6 7"
_secondaryServiceNamesYY7 M
)YYM N
{ZZ 
if[[ 
([[ 
![[ 
string[[ #
.[[# $
IsNullOrEmpty[[$ 1
([[1 2
service[[2 9
)[[9 :
)[[: ;
CheckServiceStatus\\ .
(\\. /
service\\/ 6
)\\6 7
;\\7 8
}]] 
}^^ 
try__ 
{`` 
intaa 
countaa 
=aa 
$numaa  !
;aa! "
boolbb 
runningStatusbb &
=bb' (
Globalsbb) 0
.bb0 1
IsUIProjectRunningbb1 C
&&bbD F
GlobalsbbG N
.bbN O
IsAPIProjectRunningbbO b
&&bbc e
Globalscc 
.cc  %
IsReportingProjectRunningcc  9
&&cc: <
Globalscc= D
.ccD E*
IsReportDesignerProjectRunningccE c
&&ccd f
Globalsdd 
.dd  (
IsReportViewerProjectRunningdd  <
&&dd= ?
Globalsdd@ G
.ddG H*
IsIdentityServerProjectRunningddH f
&&ddg i
Globalsee 
.ee  /
#IsEnterpriseSearchAPIProjectRunningee  C
&&eeD F
GlobalseeG N
.eeN O!
IsMySQLServiceRunningeeO d
&&eee g
Globalsff 
.ff  $
IsMySQLDevServiceRunningff  8
&&ff9 ;
Globalsgg 
.gg  #
IsMongoDBServiceRunninggg  7
&&gg8 :
Globalsgg; B
.ggB C$
IsRabbitMQServiceRunningggC [
&&gg\ ^
Globalshh 
.hh  #
IsElasticServiceRunninghh  7
&&hh8 :
Globalshh; B
.hhB C!
IsEmailServiceRunninghhC X
&&hhY [
Globalsii 
.ii  #
IsPricingServiceRunningii  7
&&ii8 :
Globalsii; B
.iiB C,
 IsEnterpriseSearchServiceRunningiiC c
;iic d
ifjj 
(jj 
!jj 
runningStatusjj &
)jj& '
{kk 
tryll 
{mm 
StartAllApplicationnn /
(nn/ 0
)nn0 1
;nn1 2
ifoo 
(oo  
countoo  %
<=oo& (
	_tryCountoo) 2
)oo2 3
{pp 
Threadqq  &
.qq& '
Sleepqq' ,
(qq, -
_sleepTimeInSecqq- <
*qq= >
$numqq? C
)qqC D
;qqD E
countrr  %
++rr% '
;rr' (
CheckAllAPIStatusss  1
(ss1 2
)ss2 3
;ss3 4
}tt 
	EmailSentuu %
(uu% &
falseuu& +
,uu+ ,
stringuu- 3
.uu3 4
Emptyuu4 9
)uu9 :
;uu: ;
}vv 
catchww 
(ww 
	Exceptionww (
exww) +
)ww+ ,
{xx 
Globalsyy #
.yy# $
_errorStackTraceyy$ 4
+=yy5 7
stringyy8 >
.yy> ?
Formatyy? E
(yyE F
$stryyF ]
,yy] ^
exyy_ a
.yya b
Messageyyb i
,yyi j
exyyk m
.yym n

StackTraceyyn x
)yyx y
;yyy z
SaveErrorLogzz (
(zz( )
exzz) +
)zz+ ,
;zz, -
}{{ 
}|| 
}}} 
catch~~ 
(~~ 
	Exception~~  
ex~~! #
)~~# $
{ 
Globals
€€ 
.
€€ 
_errorStackTrace
€€ ,
+=
€€- /
string
€€0 6
.
€€6 7
Format
€€7 =
(
€€= >
$str
€€> U
,
€€U V
ex
€€W Y
.
€€Y Z
Message
€€Z a
,
€€a b
ex
€€c e
.
€€e f

StackTrace
€€f p
)
€€p q
;
€€q r
SaveErrorLog
  
(
  !
ex
! #
)
# $
;
$ %
}
‚‚ 
}
„„ 
}
…… 	
public
ˆˆ 
static
ˆˆ 
async
ˆˆ 
Task
ˆˆ  
<
ˆˆ  !
ResponseResult
ˆˆ! /
>
ˆˆ/ 0
checkAPIStatus
ˆˆ1 ?
(
ˆˆ? @
string
ˆˆ@ F
url
ˆˆG J
,
ˆˆJ K
string
ˆˆL R
APIPath
ˆˆS Z
)
ˆˆZ [
{
‰‰ 	
Console
ŠŠ 
.
ŠŠ 
	WriteLine
ŠŠ 
(
ŠŠ 
$str
ŠŠ <
+
ŠŠ= >
url
ŠŠ? B
)
ŠŠB C
;
ŠŠC D
ResponseResult
‹‹ 
resposeResult
‹‹ (
=
‹‹) *
new
‹‹+ .
ResponseResult
‹‹/ =
(
‹‹= >
)
‹‹> ?
{
‹‹@ A
status
‹‹B H
=
‹‹I J
$str
‹‹K S
}
‹‹T U
;
‹‹U V
try
ŒŒ 
{
 

HttpClient
 
client
 !
=
" #
new
$ '

HttpClient
( 2
(
2 3
)
3 4
;
4 5
client
 
.
 
BaseAddress
 "
=
# $
new
% (
Uri
) ,
(
, -
url
- 0
)
0 1
;
1 2
var
 
responseTask
  
=
! "
client
# )
.
) *
GetAsync
* 2
(
2 3
APIPath
3 :
)
: ;
;
; <
responseTask
‘‘ 
.
‘‘ 
Wait
‘‘ !
(
‘‘! "
)
‘‘" #
;
‘‘# $
var
’’ 
result
’’ 
=
’’ 
responseTask
’’ )
.
’’) *
Result
’’* 0
;
’’0 1
if
““ 
(
““ 
result
““ 
.
““ !
IsSuccessStatusCode
““ .
)
““. /
{
”” 
resposeResult
•• !
=
••" #
new
••$ '
ResponseResult
••( 6
(
••6 7
)
••7 8
{
••9 :
status
••; A
=
••B C
$str
••D M
}
••N O
;
••O P
}
–– $
CheckApplicationStatus
—— &
(
——& '
url
——' *
,
——* +
resposeResult
——, 9
)
——9 :
;
——: ;
return
˜˜ 
resposeResult
˜˜ $
;
˜˜$ %
}
™™ 
catch
šš 
(
šš 
	Exception
šš 
ex
šš 
)
šš  
{
›› 
Globals
œœ 
.
œœ 
_errorStackTrace
œœ (
+=
œœ) +
string
œœ, 2
.
œœ2 3
Format
œœ3 9
(
œœ9 :
$str
œœ: Q
,
œœQ R
ex
œœS U
.
œœU V
Message
œœV ]
,
œœ] ^
ex
œœ_ a
.
œœa b

StackTrace
œœb l
)
œœl m
;
œœm n
SaveErrorLog
 
(
 
ex
 
)
  
;
  !
return
 
resposeResult
 $
;
$ %
}
ŸŸ 
}
   	
public
¤¤ 
static
¤¤ 
void
¤¤ $
CheckApplicationStatus
¤¤ 1
(
¤¤1 2
string
¤¤2 8
url
¤¤9 <
,
¤¤< =
ResponseResult
¤¤> L
resposneResult
¤¤M [
)
¤¤[ \
{
¥¥ 	
if
¦¦ 
(
¦¦ 
url
¦¦ 
==
¦¦ 
Globals
¦¦ 
.
¦¦ 
_baseUrl
¦¦ '
)
¦¦' (
{
§§ 
Globals
¨¨ 
.
¨¨  
IsUIProjectRunning
¨¨ *
=
¨¨+ ,!
SetAPIRunningStatus
¨¨- @
(
¨¨@ A
$str
¨¨A I
,
¨¨I J
resposneResult
¨¨K Y
)
¨¨Y Z
;
¨¨Z [
}
©© 
else
ªª 
if
ªª 
(
ªª 
url
ªª 
==
ªª 
Globals
ªª #
.
ªª# $
_apiUrl
ªª$ +
)
ªª+ ,
{
«« 
Globals
¬¬ 
.
¬¬ !
IsAPIProjectRunning
¬¬ +
=
¬¬, -!
SetAPIRunningStatus
¬¬. A
(
¬¬A B
$str
¬¬B K
,
¬¬K L
resposneResult
¬¬M [
)
¬¬[ \
;
¬¬\ ]
}
­­ 
else
®® 
if
®® 
(
®® 
url
®® 
==
®® 
Globals
®® #
.
®®# $
_reportingUrl
®®$ 1
)
®®1 2
{
¯¯ 
Globals
°° 
.
°° '
IsReportingProjectRunning
°° 1
=
°°2 3!
SetAPIRunningStatus
°°4 G
(
°°G H
$str
°°H W
,
°°W X
resposneResult
°°Y g
)
°°g h
;
°°h i
}
±± 
else
²² 
if
²² 
(
²² 
url
²² 
==
²² 
Globals
²² #
.
²²# $ 
_reportDesignerUrl
²²$ 6
)
²²6 7
{
³³ 
Globals
´´ 
.
´´ ,
IsReportDesignerProjectRunning
´´ 6
=
´´7 8!
SetAPIRunningStatus
´´9 L
(
´´L M
$str
´´M b
,
´´b c
resposneResult
´´d r
)
´´r s
;
´´s t
}
µµ 
else
¶¶ 
if
¶¶ 
(
¶¶ 
url
¶¶ 
==
¶¶ 
Globals
¶¶ #
.
¶¶# $
_reportViewerUrl
¶¶$ 4
)
¶¶4 5
{
·· 
Globals
¸¸ 
.
¸¸ *
IsReportViewerProjectRunning
¸¸ 4
=
¸¸5 6!
SetAPIRunningStatus
¸¸7 J
(
¸¸J K
$str
¸¸K ^
,
¸¸^ _
resposneResult
¸¸` n
)
¸¸n o
;
¸¸o p
}
¹¹ 
else
ºº 
if
ºº 
(
ºº 
url
ºº 
==
ºº 
Globals
ºº #
.
ºº# $
_identityUrl
ºº$ 0
)
ºº0 1
{
»» 
Globals
¼¼ 
.
¼¼ ,
IsIdentityServerProjectRunning
¼¼ 6
=
¼¼7 8!
SetAPIRunningStatus
¼¼9 L
(
¼¼L M
$str
¼¼M b
,
¼¼b c
resposneResult
¼¼d r
)
¼¼r s
;
¼¼s t
}
½½ 
else
¾¾ 
if
¾¾ 
(
¾¾ 
url
¾¾ 
==
¾¾ 
Globals
¾¾ #
.
¾¾# $
_enterpriseUrl
¾¾$ 2
)
¾¾2 3
{
¿¿ 
Globals
ÀÀ 
.
ÀÀ 1
#IsEnterpriseSearchAPIProjectRunning
ÀÀ ;
=
ÀÀ< =!
SetAPIRunningStatus
ÀÀ> Q
(
ÀÀQ R
$str
ÀÀR i
,
ÀÀi j
resposneResult
ÀÀk y
)
ÀÀy z
;
ÀÀz {
}
ÁÁ 
}
ÂÂ 	
public
ÅÅ 
static
ÅÅ 
bool
ÅÅ !
SetAPIRunningStatus
ÅÅ .
(
ÅÅ. /
string
ÅÅ/ 5
name
ÅÅ6 :
,
ÅÅ: ;
ResponseResult
ÅÅ< J
resposneResult
ÅÅK Y
)
ÅÅY Z
{
ÆÆ 	
if
ÇÇ 
(
ÇÇ 
resposneResult
ÇÇ 
!=
ÇÇ !
null
ÇÇ" &
&&
ÇÇ' )
resposneResult
ÇÇ* 8
.
ÇÇ8 9
status
ÇÇ9 ?
!=
ÇÇ@ B
null
ÇÇC G
&&
ÇÇH J
resposneResult
ÇÇK Y
.
ÇÇY Z
status
ÇÇZ `
==
ÇÇa c
$str
ÇÇd m
)
ÇÇm n
{
ÈÈ 
Globals
ÉÉ 
.
ÉÉ 
	_bodyText
ÉÉ !
+=
ÉÉ" $
SetBodyText
ÉÉ% 0
(
ÉÉ0 1
name
ÉÉ1 5
,
ÉÉ5 6
true
ÉÉ7 ;
)
ÉÉ; <
;
ÉÉ< =
return
ÊÊ 
true
ÊÊ 
;
ÊÊ 
}
ËË 
Globals
ÌÌ 
.
ÌÌ 
	_bodyText
ÌÌ 
+=
ÌÌ  
SetBodyText
ÌÌ! ,
(
ÌÌ, -
name
ÌÌ- 1
,
ÌÌ1 2
false
ÌÌ3 8
)
ÌÌ8 9
;
ÌÌ9 :
return
ÍÍ 
false
ÍÍ 
;
ÍÍ 
}
ÎÎ 	
public
ÑÑ 
static
ÑÑ 
string
ÑÑ 
SetBodyText
ÑÑ (
(
ÑÑ( )
string
ÑÑ) /
ProjectName
ÑÑ0 ;
,
ÑÑ; <
bool
ÑÑ= A
RunningStatus
ÑÑB O
)
ÑÑO P
{
ÒÒ 	
if
ÓÓ 
(
ÓÓ 
!
ÓÓ 
string
ÓÓ 
.
ÓÓ 
IsNullOrEmpty
ÓÓ %
(
ÓÓ% &
ProjectName
ÓÓ& 1
)
ÓÓ1 2
)
ÓÓ2 3
{
ÔÔ 
string
ÕÕ 

statusText
ÕÕ !
=
ÕÕ" #
RunningStatus
ÕÕ$ 1
?
ÕÕ2 3
$str
ÕÕ4 8
:
ÕÕ9 :
$str
ÕÕ; A
;
ÕÕA B
string
ÖÖ 
statusColor
ÖÖ "
=
ÖÖ# $
RunningStatus
ÖÖ% 2
?
ÖÖ3 4
$str
ÖÖ5 >
:
ÖÖ? @
$str
ÖÖA J
;
ÖÖJ K
return
×× 
$str
×× 1
+
××1 2
statusColor
××3 >
.
××> ?
ToString
××? G
(
××G H
)
××H I
+
××J K
$str××L ‡
+××ˆ ‰
ProjectName××Š •
+××– —
$str××˜ Ø
+××Ù Ú

statusText××Û å
+××æ ç
$str××è ¨
+××© ª
DateTime××« ³
.××³ ´
UtcNow××´ º
.××º »
ToString××» Ã
(××Ã Ä
$str××Ä Ù
)××Ù Ú
+××Û Ü
$str××İ û
;××û ü
}
ØØ 
return
ÙÙ 
$str
ÙÙ 
;
ÙÙ 
}
ÚÚ 	
public
İİ 
static
İİ 
void
İİ !
StartAllApplication
İİ .
(
İİ. /
)
İİ/ 0
{
ŞŞ 	
try
ßß 
{
àà 
var
áá 
ps1File
áá 
=
áá 
Globals
áá %
.
áá% &'
_powerShellScriptFilePath
áá& ?
;
áá? @
var
ââ 
	startInfo
ââ 
=
ââ 
new
ââ  #
ProcessStartInfo
ââ$ 4
(
ââ4 5
)
ââ5 6
{
ãã 
FileName
ää 
=
ää 
Globals
ää &
.
ää& '"
_powerShellScriptExe
ää' ;
,
ää; <
	Arguments
åå 
=
åå 
$"
åå  "
$str
åå" S
{
ååS T
ps1File
ååT [
}
åå[ \
$str
åå\ ^
"
åå^ _
,
åå_ `
UseShellExecute
ææ #
=
ææ$ %
false
ææ& +
}
çç 
;
çç 
Process
èè 
.
èè 
Start
èè 
(
èè 
	startInfo
èè '
)
èè' (
;
èè( )
}
éé 
catch
êê 
(
êê 
	Exception
êê 
ex
êê 
)
êê  
{
ëë 
Globals
ìì 
.
ìì 
_errorStackTrace
ìì (
+=
ìì) +
string
ìì, 2
.
ìì2 3
Format
ìì3 9
(
ìì9 :
$str
ìì: Q
,
ììQ R
ex
ììS U
.
ììU V
Message
ììV ]
,
ìì] ^
ex
ìì_ a
.
ììa b

StackTrace
ììb l
)
ììl m
;
ììm n
SaveErrorLog
íí 
(
íí 
ex
íí 
)
íí  
;
íí  !
}
îî 
}
ïï 	
public
ññ 
static
ññ 
async
ññ 
void
ññ  
CheckAllAPIStatus
ññ! 2
(
ññ2 3
)
ññ3 4
{
ññ5 6
string
óó 

testUIPath
óó 
=
óó 
$str
óó  "
;
óó" #
var
ôô &
checkUIProjectStatusTask
ôô (
=
ôô) *
Task
ôô+ /
.
ôô/ 0
Factory
ôô0 7
.
ôô7 8
StartNew
ôô8 @
(
ôô@ A
(
ôôA B
)
ôôB C
=>
ôôD F
checkAPIStatus
ôôG U
(
ôôU V
Globals
ôôV ]
.
ôô] ^
_baseUrl
ôô^ f
,
ôôf g

testUIPath
ôôh r
)
ôôr s
)
ôôs t
;
ôôt u
string
÷÷ 
testAPIPath
÷÷ 
=
÷÷  
$str
÷÷! %
;
÷÷% &
var
øø '
checkAPIProjectStatusTask
øø )
=
øø* +
Task
øø, 0
.
øø0 1
Factory
øø1 8
.
øø8 9
StartNew
øø9 A
(
øøA B
(
øøB C
)
øøC D
=>
øøE G
checkAPIStatus
øøH V
(
øøV W
Globals
øøW ^
.
øø^ _
_apiUrl
øø_ f
,
øøf g
testAPIPath
øøh s
+
øøt u
$strøøv ¨
)øø¨ ©
)øø© ª
;øøª «
string
ûû 
testReportingPath
ûû $
=
ûû% &
$str
ûû' /
;
ûû/ 0
var
üü -
checkReportingProjectStatusTask
üü /
=
üü0 1
Task
üü2 6
.
üü6 7
Factory
üü7 >
.
üü> ?
StartNew
üü? G
(
üüG H
(
üüH I
)
üüI J
=>
üüK M
checkAPIStatus
üüN \
(
üü\ ]
Globals
üü] d
.
üüd e
_reportingUrl
üüe r
,
üür s 
testReportingPathüüt …
)üü… †
)üü† ‡
;üü‡ ˆ
string
ÿÿ $
testReportDesignerPath
ÿÿ )
=
ÿÿ* +
$str
ÿÿ, H
;
ÿÿH I
var
€€ 2
$checkReportDesignerProjectStatusTask
€€ 4
=
€€5 6
Task
€€7 ;
.
€€; <
Factory
€€< C
.
€€C D
StartNew
€€D L
(
€€L M
(
€€M N
)
€€N O
=>
€€P R
checkAPIStatus
€€S a
(
€€a b
Globals
€€b i
.
€€i j 
_reportDesignerUrl
€€j |
,
€€| }%
testReportDesignerPath€€~ ”
)€€” •
)€€• –
;€€– —
string
ƒƒ "
testReportViewerPath
ƒƒ '
=
ƒƒ( )
$str
ƒƒ* F
;
ƒƒF G
var
„„ 0
"checkReportViewerProjectStatusTask
„„ 2
=
„„3 4
Task
„„5 9
.
„„9 :
Factory
„„: A
.
„„A B
StartNew
„„B J
(
„„J K
(
„„K L
)
„„L M
=>
„„N P
checkAPIStatus
„„Q _
(
„„_ `
Globals
„„` g
.
„„g h
_reportViewerUrl
„„h x
,
„„x y#
testReportViewerPath„„z 
)„„ 
)„„ 
;„„ ‘
string
‡‡ $
testIdentityServerPath
‡‡ )
=
‡‡* +
$str
‡‡, N
;
‡‡N O
var
ˆˆ 2
$checkIdentityServerProjectStatusTask
ˆˆ 4
=
ˆˆ5 6
Task
ˆˆ7 ;
.
ˆˆ; <
Factory
ˆˆ< C
.
ˆˆC D
StartNew
ˆˆD L
(
ˆˆL M
(
ˆˆM N
)
ˆˆN O
=>
ˆˆP R
checkAPIStatus
ˆˆS a
(
ˆˆa b
Globals
ˆˆb i
.
ˆˆi j
_identityUrl
ˆˆj v
,
ˆˆv w%
testIdentityServerPathˆˆx 
)ˆˆ 
)ˆˆ 
;ˆˆ ‘
string
‹‹ )
testEnterpriseSearchAPIPath
‹‹ .
=
‹‹/ 0
$str
‹‹1 9
;
‹‹9 :
var
ŒŒ 8
*checkEnterpriseServiceAPIProjectStatusTask
ŒŒ :
=
ŒŒ; <
Task
ŒŒ= A
.
ŒŒA B
Factory
ŒŒB I
.
ŒŒI J
StartNew
ŒŒJ R
(
ŒŒR S
(
ŒŒS T
)
ŒŒT U
=>
ŒŒV X
checkAPIStatus
ŒŒY g
(
ŒŒg h
Globals
ŒŒh o
.
ŒŒo p
_enterpriseUrl
ŒŒp ~
,
ŒŒ~ +
testEnterpriseSearchAPIPathŒŒ€ ›
)ŒŒ› œ
)ŒŒœ 
;ŒŒ 
await
 
Task
 
.
 
WhenAll
 
(
 &
checkUIProjectStatusTask
 7
,
7 8'
checkAPIProjectStatusTask
9 R
,
R S-
checkReportingProjectStatusTask
T s
,
s t2
$checkReportDesignerProjectStatusTask
 4
,
4 50
"checkReportViewerProjectStatusTask
6 X
,
X Y2
$checkIdentityServerProjectStatusTask
Z ~
,
~ 8
*checkEnterpriseServiceAPIProjectStatusTask
 :
)
: ;
;
; <
}
’’ 	
public
•• 
static
•• 
void
••  
CheckServiceStatus
•• -
(
••- .
string
••. 4
name
••5 9
)
••9 :
{
–– 	
Console
—— 
.
—— 
	WriteLine
—— 
(
—— 
$str
—— @
+
——A B
name
——C G
)
——G H
;
——H I
ServiceController
˜˜ 
sc
˜˜  
=
˜˜! "
new
˜˜# &
ServiceController
˜˜' 8
(
˜˜8 9
name
˜˜9 =
)
˜˜= >
;
˜˜> ?
if
™™ 
(
™™ 
name
™™ 
==
™™ 
Globals
™™ 
.
™™  
_mySQLServiceName
™™  1
)
™™1 2
{
šš 
Globals
›› 
.
›› #
IsMySQLServiceRunning
›› -
=
››. /
SetRunningStatus
››0 @
(
››@ A
sc
››A C
,
››C D
name
››E I
)
››I J
;
››J K
}
œœ 
if
 
(
 
name
 
==
 
Globals
 
.
  "
_mySQLDevServiceName
  4
)
4 5
{
 
Globals
ŸŸ 
.
ŸŸ &
IsMySQLDevServiceRunning
ŸŸ 0
=
ŸŸ1 2
SetRunningStatus
ŸŸ3 C
(
ŸŸC D
sc
ŸŸD F
,
ŸŸF G
name
ŸŸH L
)
ŸŸL M
;
ŸŸM N
}
   
else
¡¡ 
if
¡¡ 
(
¡¡ 
name
¡¡ 
==
¡¡ 
Globals
¡¡ $
.
¡¡$ %!
_mongoDBServiceName
¡¡% 8
)
¡¡8 9
{
¢¢ 
Globals
££ 
.
££ %
IsMongoDBServiceRunning
££ /
=
££0 1
SetRunningStatus
££2 B
(
££B C
sc
££C E
,
££E F
name
££G K
)
££K L
;
££L M
}
¤¤ 
else
¥¥ 
if
¥¥ 
(
¥¥ 
name
¥¥ 
==
¥¥ 
Globals
¥¥ $
.
¥¥$ %"
_rabbitMQServiceName
¥¥% 9
)
¥¥9 :
{
¦¦ 
Globals
§§ 
.
§§ &
IsRabbitMQServiceRunning
§§ 0
=
§§1 2
SetRunningStatus
§§3 C
(
§§C D
sc
§§D F
,
§§F G
name
§§H L
)
§§L M
;
§§M N
}
¨¨ 
else
©© 
if
©© 
(
©© 
name
©© 
==
©© 
Globals
©© $
.
©©$ %'
_elasticSearchServiceName
©©% >
)
©©> ?
{
ªª 
Globals
«« 
.
«« %
IsElasticServiceRunning
«« /
=
««0 1
SetRunningStatus
««2 B
(
««B C
sc
««C E
,
««E F
name
««G K
)
««K L
;
««L M
}
¬¬ 
else
­­ 
if
­­ 
(
­­ 
name
­­ 
==
­­ 
Globals
­­ $
.
­­$ %$
_q2CPricingServiceName
­­% ;
)
­­; <
{
®® 
Globals
¯¯ 
.
¯¯ %
IsPricingServiceRunning
¯¯ /
=
¯¯0 1
SetRunningStatus
¯¯2 B
(
¯¯B C
sc
¯¯C E
,
¯¯E F
name
¯¯G K
)
¯¯K L
;
¯¯L M
}
°° 
else
±± 
if
±± 
(
±± 
name
±± 
==
±± 
Globals
±± $
.
±±$ %"
_q2CEmailServiceName
±±% 9
)
±±9 :
{
²² 
Globals
³³ 
.
³³ #
IsEmailServiceRunning
³³ -
=
³³. /
SetRunningStatus
³³0 @
(
³³@ A
sc
³³A C
,
³³C D
name
³³E I
)
³³I J
;
³³J K
}
´´ 
else
µµ 
if
µµ 
(
µµ 
name
µµ 
==
µµ 
Globals
µµ $
.
µµ$ %)
_q2CSearchEngineServiceName
µµ% @
)
µµ@ A
{
¶¶ 
Globals
·· 
.
·· .
 IsEnterpriseSearchServiceRunning
·· 8
=
··9 :
SetRunningStatus
··; K
(
··K L
sc
··L N
,
··N O
name
··P T
)
··T U
;
··U V
}
¸¸ 
}
¹¹ 	
public
¼¼ 
static
¼¼ 
bool
¼¼ 
SetRunningStatus
¼¼ +
(
¼¼+ ,
ServiceController
¼¼, =
sc
¼¼> @
,
¼¼@ A
string
¼¼B H
name
¼¼I M
)
¼¼M N
{
½½ 	
try
¾¾ 
{
¿¿ 
int
ÀÀ 
count
ÀÀ 
=
ÀÀ 
$num
ÀÀ 
;
ÀÀ 
if
ÁÁ 
(
ÁÁ 
sc
ÁÁ 
.
ÁÁ 
Status
ÁÁ 
==
ÁÁ  %
ServiceControllerStatus
ÁÁ! 8
.
ÁÁ8 9
Stopped
ÁÁ9 @
)
ÁÁ@ A
{
ÂÂ 
StartService
ÃÃ  
(
ÃÃ  !
sc
ÃÃ! #
)
ÃÃ# $
;
ÃÃ$ %
if
ÄÄ 
(
ÄÄ 
count
ÄÄ 
<=
ÄÄ  
	_tryCount
ÄÄ! *
)
ÄÄ* +
{
ÅÅ 
Thread
ÆÆ 
.
ÆÆ 
Sleep
ÆÆ $
(
ÆÆ$ %
_sleepTimeInSec
ÆÆ% 4
*
ÆÆ5 6
$num
ÆÆ7 ;
)
ÆÆ; <
;
ÆÆ< =
count
ÇÇ 
++
ÇÇ 
;
ÇÇ  
ServiceController
ÈÈ )
sc_retry
ÈÈ* 2
=
ÈÈ3 4
new
ÈÈ5 8
ServiceController
ÈÈ9 J
(
ÈÈJ K
name
ÈÈK O
)
ÈÈO P
;
ÈÈP Q
SetRunningStatus
ÉÉ (
(
ÉÉ( )
sc_retry
ÉÉ) 1
,
ÉÉ1 2
name
ÉÉ3 7
)
ÉÉ7 8
;
ÉÉ8 9
}
ÊÊ 
Globals
ËË 
.
ËË 
	_bodyText
ËË %
+=
ËË& (
SetBodyText
ËË) 4
(
ËË4 5
name
ËË5 9
,
ËË9 :
false
ËË; @
)
ËË@ A
;
ËËA B
return
ÌÌ 
false
ÌÌ  
;
ÌÌ  !
}
ÍÍ 
Globals
ÎÎ 
.
ÎÎ 
	_bodyText
ÎÎ !
+=
ÎÎ" $
SetBodyText
ÎÎ% 0
(
ÎÎ0 1
name
ÎÎ1 5
,
ÎÎ5 6
true
ÎÎ7 ;
)
ÎÎ; <
;
ÎÎ< =
return
ÏÏ 
true
ÏÏ 
;
ÏÏ 
}
ĞĞ 
catch
ÑÑ 
(
ÑÑ 
	Exception
ÑÑ 
ex
ÑÑ 
)
ÑÑ  
{
ÒÒ 
Globals
ÓÓ 
.
ÓÓ 
	_bodyText
ÓÓ !
+=
ÓÓ" $
SetBodyText
ÓÓ% 0
(
ÓÓ0 1
name
ÓÓ1 5
,
ÓÓ5 6
false
ÓÓ7 <
)
ÓÓ< =
;
ÓÓ= >
Globals
ÔÔ 
.
ÔÔ 
_errorStackTrace
ÔÔ (
+=
ÔÔ) +
string
ÔÔ, 2
.
ÔÔ2 3
Format
ÔÔ3 9
(
ÔÔ9 :
$str
ÔÔ: Q
,
ÔÔQ R
ex
ÔÔS U
.
ÔÔU V
Message
ÔÔV ]
,
ÔÔ] ^
ex
ÔÔ_ a
.
ÔÔa b

StackTrace
ÔÔb l
)
ÔÔl m
;
ÔÔm n
SaveErrorLog
ÕÕ 
(
ÕÕ 
ex
ÕÕ 
)
ÕÕ  
;
ÕÕ  !
return
ÖÖ 
false
ÖÖ 
;
ÖÖ 
}
×× 
}
ØØ 	
public
ÚÚ 
static
ÚÚ 
void
ÚÚ 
StartService
ÚÚ '
(
ÚÚ' (
ServiceController
ÚÚ( 9
sc
ÚÚ: <
)
ÚÚ< =
{
ÛÛ 	
sc
ÜÜ 
.
ÜÜ 
Start
ÜÜ 
(
ÜÜ 
)
ÜÜ 
;
ÜÜ 
}
İİ 	
public
àà 
static
àà 
void
àà 
	EmailSent
àà $
(
àà$ %
bool
àà% )
isError
àà* 1
,
àà1 2
string
àà3 9
Message
àà: A
)
ààA B
{
áá 	
string
ââ 

_ipAddress
ââ 
=
ââ 
GetLocalIPAddress
ââ  1
(
ââ1 2
)
ââ2 3
;
ââ3 4
string
ãã 
_systemName
ãã 
=
ãã  
Environment
ãã! ,
.
ãã, -
MachineName
ãã- 8
;
ãã8 9
string
ää 
_subject
ää 
=
ää 
string
ää $
.
ää$ %
Empty
ää% *
;
ää* +
string
åå 
_body
åå 
=
åå 
string
åå !
.
åå! "
Empty
åå" '
;
åå' (
_subject
ææ 
=
ææ 
$str
ææ 7
;
ææ7 8
string
çç 
currentDate
çç 
=
çç  
DateTime
çç! )
.
çç) *
UtcNow
çç* 0
.
çç0 1
ToString
çç1 9
(
çç9 :
$str
çç: L
)
ççL M
;
ççM N
string
éé 
bodyCSSClass
éé 
=
éé  !
$str
éé" +
;
éé+ ,
_body
êê 
=
êê 
string
êê 
.
êê 
Format
êê !
(
êê! "
$strêê" Ø
,êêØ Ù
bodyCSSClassêêÚ æ
,êêæ ç
Globalsêêè ï
.êêï ğ
_systemDetailsêêğ ş
,êêş ÿ
_systemNameêê€ ‹
,êê‹ Œ

_ipAddressêê —
,êê— ˜
currentDateêê™ ¤
)êê¤ ¥
;êê¥ ¦
_body
ëë 
+=
ëë 
$str
ëë f
;
ëëf g
_body
ìì 
+=
ìì 
$strìì €
+ìì ‚
Globalsììƒ Š
.ììŠ ‹
	_bodyTextìì‹ ”
+ìì• –
$strìì— ©
;ìì© ª
if
íí 
(
íí 
!
íí 
string
íí 
.
íí 
IsNullOrEmpty
íí %
(
íí% &
Globals
íí& -
.
íí- .
_errorStackTrace
íí. >
)
íí> ?
)
íí? @
{
îî 
_body
ïï 
=
ïï 
_body
ïï 
+
ïï 
$str
ïï  7
+
ïï8 9
Globals
ïï: A
.
ïïA B
_errorStackTrace
ïïB R
;
ïïR S
}
ğğ 
try
ññ 
{
òò 

EmailModel
óó 

emailModel
óó %
=
óó& '
new
óó( +

EmailModel
óó, 6
(
óó6 7
)
óó7 8
{
ôô 
To
õõ 
=
õõ 
_adminEmailID
õõ &
,
õõ& '
Subject
öö 
=
öö 
string
öö $
.
öö$ %
Format
öö% +
(
öö+ ,
_subject
öö, 4
,
öö4 5
Globals
öö6 =
.
öö= >
_systemDetails
öö> L
)
ööL M
,
ööM N
Body
÷÷ 
=
÷÷ 
_body
÷÷  
}
øø 
;
øø 
EmailService
ùù 
emailService
ùù )
=
ùù* +
new
ùù, /
EmailService
ùù0 <
(
ùù< =
)
ùù= >
;
ùù> ?
emailService
úú 
.
úú #
commonSendEmailDetail
úú 2
(
úú2 3

emailModel
úú3 =
)
úú= >
;
úú> ?
Environment
ûû 
.
ûû 
Exit
ûû  
(
ûû  !
$num
ûû! "
)
ûû" #
;
ûû# $
}
üü 
catch
ıı 
(
ıı 
	Exception
ıı 
ex
ıı 
)
ıı  
{
şş 
SaveErrorLog
ÿÿ 
(
ÿÿ 
ex
ÿÿ 
)
ÿÿ  
;
ÿÿ  !
}
€€ 
}
 	
public
ƒƒ 
static
ƒƒ 
string
ƒƒ 
GetLocalIPAddress
ƒƒ .
(
ƒƒ. /
)
ƒƒ/ 0
{
„„ 	
var
…… 
host
…… 
=
…… 
Dns
…… 
.
…… 
GetHostEntry
…… '
(
……' (
Dns
……( +
.
……+ ,
GetHostName
……, 7
(
……7 8
)
……8 9
)
……9 :
;
……: ;
foreach
†† 
(
†† 
var
†† 
ip
†† 
in
†† 
host
†† #
.
††# $
AddressList
††$ /
)
††/ 0
{
‡‡ 
if
ˆˆ 
(
ˆˆ 
ip
ˆˆ 
.
ˆˆ 
AddressFamily
ˆˆ $
==
ˆˆ% '
AddressFamily
ˆˆ( 5
.
ˆˆ5 6
InterNetwork
ˆˆ6 B
)
ˆˆB C
{
‰‰ 
return
ŠŠ 
ip
ŠŠ 
.
ŠŠ 
ToString
ŠŠ &
(
ŠŠ& '
)
ŠŠ' (
;
ŠŠ( )
}
‹‹ 
}
ŒŒ 
throw
 
new
 
	Exception
 
(
  
$str
  Y
)
Y Z
;
Z [
}
 	
public
 
static
 
bool
 
ValidateJSON
 '
(
' (
string
( .
response
/ 7
)
7 8
{
‘‘ 	
try
’’ 
{
““ 
JToken
”” 
.
”” 
Parse
”” 
(
”” 
response
”” %
)
””% &
;
””& '
return
•• 
true
•• 
;
•• 
}
–– 
catch
—— 
(
—— !
JsonReaderException
—— &
ex
——' )
)
——) *
{
˜˜ 
return
™™ 
false
™™ 
;
™™ 
}
šš 
}
›› 	
public
œœ 
static
œœ 
void
œœ 
SaveErrorLog
œœ '
(
œœ' (
	Exception
œœ( 1
ex
œœ2 4
)
œœ4 5
{
 	
try
 
{
ŸŸ 
string
   
_ErrorLogFilePath
   (
=
  ) *%
WebConfigurationManager
  + B
.
  B C
AppSettings
  C N
[
  N O
$str
  O a
]
  a b
.
  b c
ToString
  c k
(
  k l
)
  l m
;
  m n
string
¢¢ 

strLogText
¢¢ !
=
¢¢" #
ex
¢¢$ &
.
¢¢& '
Message
¢¢' .
.
¢¢. /
ToString
¢¢/ 7
(
¢¢7 8
)
¢¢8 9
;
¢¢9 :
if
££ 
(
££ 
ex
££ 
.
££ 

StackTrace
££ !
!=
££" $
null
££% )
)
££) *
{
¤¤ 

strLogText
¥¥ 
=
¥¥  

strLogText
¥¥! +
+
¥¥, -
$str
¥¥. 0
+
¥¥1 2
ex
¥¥3 5
.
¥¥5 6

StackTrace
¥¥6 @
.
¥¥@ A
ToString
¥¥A I
(
¥¥I J
)
¥¥J K
;
¥¥K L
}
¦¦ 
StreamWriter
©© 
log
©©  
;
©©  !
if
«« 
(
«« 
!
«« 
File
«« 
.
«« 
Exists
««  
(
««  !
_ErrorLogFilePath
««! 2
)
««2 3
)
««3 4
{
¬¬ 
log
­­ 
=
­­ 
new
­­ 
StreamWriter
­­ *
(
­­* +
_ErrorLogFilePath
­­+ <
)
­­< =
;
­­= >
}
®® 
else
¯¯ 
{
°° 
log
±± 
=
±± 
File
±± 
.
±± 

AppendText
±± )
(
±±) *
_ErrorLogFilePath
±±* ;
)
±±; <
;
±±< =
}
²² 
log
µµ 
.
µµ 
	WriteLine
µµ 
(
µµ 
DateTime
µµ &
.
µµ& '
Now
µµ' *
)
µµ* +
;
µµ+ ,
log
¶¶ 
.
¶¶ 
	WriteLine
¶¶ 
(
¶¶ 

strLogText
¶¶ (
)
¶¶( )
;
¶¶) *
log
·· 
.
·· 
	WriteLine
·· 
(
·· 
)
·· 
;
··  
log
ºº 
.
ºº 
Close
ºº 
(
ºº 
)
ºº 
;
ºº 
}
»» 
catch
¼¼ 
(
¼¼ 
	Exception
¼¼ 
)
¼¼ 
{
½½ 
}
¿¿ 
}
ÀÀ 	
}
ÁÁ 
}ÂÂ ó
HD:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Properties\AssemblyInfo.cs
[ 
assembly 	
:	 

AssemblyTitle 
( 
$str -
)- .
]. /
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
$str /
)/ 0
]0 1
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