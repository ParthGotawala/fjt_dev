ê
ND:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\ConnectionStrings.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
{ 
public 

class 
ConnectionStrings "
{		 
public

 
string

 
DefaultConnection

 '
{

( )
get

* -
;

- .
set

/ 2
;

2 3
}

4 5
public 
string 
ReportConnection &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
} 
} ¨
ID:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\ConstantPath.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
{ 
public 

class 
ConstantPath 
{		 
public

 
string

 

ReportPath

  
{

! "
get

# &
;

& '
set

( +
;

+ ,
}

- .
public 
string 
TemplateReportPath (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string %
SystemGeneratedReportPath /
{0 1
get2 5
;5 6
set7 :
;: ;
}< =
public 
string 
	UiPageUrl 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
IdentityserverURL '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
APIURL 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
RoHSImagesPath $
{% &
get' *
;* +
set, /
;/ 0
}1 2
} 
} ±
QD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\IdentityserverConfig.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
{ 
public 

class  
IdentityserverConfig %
{		 
public

 
string

 
ClientId

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
string 
ClientSecret "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string  
AuthenticationScheme *
{+ ,
get- 0
;0 1
set2 5
;5 6
}7 8
} 
} ≈
JD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\MongoDBConfig.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
{ 
public 

class 
MongoDBConfig 
{		 
public

 
string

 #
MongoDBConnectionString

 -
{

. /
get

0 3
;

3 4
set

5 8
;

8 9
}

: ;
public 
string 
DBName 
{ 
get "
;" #
set$ '
;' (
}) *
public 
MongoCollections 
MongoCollections  0
{1 2
get3 6
;6 7
set8 ;
;; <
}= >
} 
public 

class 
MongoCollections !
{ 
public 
string (
DynamicMessageCollectionName 2
{3 4
get5 8
;8 9
set: =
;= >
}? @
} 
} â
PD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\AuthorizeController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
[ 
AllowAnonymous 
] 
public 

class 
AuthorizeController $
:% &

Controller' 1
{ 
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
public 
AuthorizeController "
(" #"
IDynamicMessageService# 9!
dynamicMessageService: O
)O P
{ 	"
_dynamicMessageService "
=# $!
dynamicMessageService% :
;: ;
} 	
public 
async 
Task 
< 
IActionResult '
>' (
AccessDenied) 5
(5 6
)6 7
{ 	
var 
accessDeniedMSG 
=  !
await" '"
_dynamicMessageService( >
.> ?
Get? B
(B C
POPUP_ACCESS_DENIEDC V
)V W
;W X
return 
View 
( 
$str 
,  
new! $
ErrorViewModel% 3
{4 5

StatusCode6 @
=A B
(C D
intD G
)G H
APIStatusCodeH U
.U V
ACCESS_DENIEDV c
,c d
Messagee l
=m n
stringo u
.u v
Formatv |
(| }
accessDeniedMSG	} å
.
å ç
message
ç î
,
î ï
	REQUESTED
ñ ü
)
ü †
}
° ¢
)
¢ £
;
£ §
} 	
public 
async 
Task 
< 
IActionResult '
>' (
NotFound) 1
(1 2
)2 3
{ 	
var   
notFoundMSG   
=   
await   #"
_dynamicMessageService  $ :
.  : ;
Get  ; >
(  > ?
	NOT_FOUND  ? H
)  H I
;  I J
return!! 
View!! 
(!! 
$str!! 
,!!  
new!!! $
ErrorViewModel!!% 3
{!!4 5

StatusCode!!6 @
=!!A B
(!!C D
int!!D G
)!!G H
APIStatusCode!!H U
.!!U V
PAGE_NOT_FOUND!!V d
,!!d e
Message!!f m
=!!n o
string!!p v
.!!v w
Format!!w }
(!!} ~
notFoundMSG	!!~ â
.
!!â ä
message
!!ä ë
,
!!ë í
REQUESTED_PAGE
!!ì °
)
!!° ¢
}
!!£ §
)
!!§ •
;
!!• ¶
}"" 	
public## 
IActionResult## 
Error## "
(##" #
ErrorViewModel### 1
errorViewModel##2 @
)##@ A
{$$ 	
return%% 
View%% 
(%% 
$str%% 
,%%  
errorViewModel%%! /
)%%/ 0
;%%0 1
}&& 	
}'' 
}(( Ü
KD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\BaseController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
public 

class 
BaseController 
:  !

Controller" ,
{ 
	protected 
readonly 
FJTSqlDBContext *
_FJTSqlDBContext+ ;
;; <
	protected 
ConstantPath 
_constantPath ,
;, -
public 
BaseController 
( 
FJTSqlDBContext -
fjtSqlDBContext. =
,= >
IOptions? G
<G H
ConstantPathH T
>T U
constantPathV b
)b c
{ 	
_FJTSqlDBContext 
= 
fjtSqlDBContext .
;. /
_constantPath 
= 
constantPath (
.( )
Value) .
;. /
} 	
	protected 
string 
	GetUserId "
(" #
)# $
{ 	
try 
{   
var!! 
userid!! 
=!! 
string!! #
.!!# $
Empty!!$ )
;!!) *
var"" 
identityUserId"" "
=""# $
HttpContext""% 0
.""0 1
User""1 5
.""5 6
Claims""6 <
.""< =
Count""= B
(""B C
)""C D
!=""E G
$num""H I
?""J K
HttpContext""L W
.""W X
User""X \
.""\ ]
	FindFirst""] f
(""f g

ClaimTypes""g q
.""q r
NameIdentifier	""r Ä
)
""Ä Å
.
""Å Ç
Value
""Ç á
:
""à â
null
""ä é
;
""é è
if## 
(## 
identityUserId## "
!=### %
null##& *
)##* +
{$$ 
userid%% 
=%% 
_FJTSqlDBContext%% -
.%%- .
users%%. 3
.%%3 4
Where%%4 9
(%%9 :
x%%: ;
=>%%< >
x%%? @
.%%@ A
IdentityUserId%%A O
==%%P R
identityUserId%%S a
)%%a b
.%%b c
Select%%c i
(%%i j
x%%j k
=>%%l n
x%%o p
.%%p q
id%%q s
)%%s t
.%%t u
FirstOrDefault	%%u É
(
%%É Ñ
)
%%Ñ Ö
.
%%Ö Ü
ToString
%%Ü é
(
%%é è
)
%%è ê
;
%%ê ë
}&& 
return'' 
userid'' 
;'' 
}(( 
catch)) 
{** 
return++ 
string++ 
.++ 
Empty++ #
;++# $
},, 
}-- 	
	protected.. 
string.. 
GetUserNameById.. (
(..( )
int..) ,
?.., -
id... 0
)..0 1
{// 	
var00 
user00 
=00 
_FJTSqlDBContext00 '
.00' (
users00( -
.00- .
Find00. 2
(002 3
id003 5
)005 6
;006 7
return11 
user11 
!=11 
null11 
?11  !
user11" &
.11& '
username11' /
:110 1
string112 8
.118 9
Empty119 >
;11> ?
}22 	
}33 
}44 ¿
]D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\CheckApplicationStatusController.cs
	namespace		 	
FJT		
 
.		 
ReportDesigner		 
.		 
Controllers		 (
{

 
[ 
Route 

(
 
$str 
) 
] 
[ 
ApiController 
] 
public 

class ,
 CheckApplicationStatusController 1
:2 3
ControllerBase4 B
{ 
[ 	
HttpGet	 
] 
public 
IEnumerable 
< 
string !
>! "
Get# &
(& '
)' (
{ 	
return 
new 
string 
[ 
] 
{  !
$str" *
,* +
$str, 4
}5 6
;6 7
} 	
} 
} €É
YD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\CustomAuthorizationAttribute.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
public 

class (
CustomAuthorizationAttribute -
:. /!
ActionFilterAttribute0 E
{ 
public 
override 
void 
OnActionExecuted -
(- .!
ActionExecutedContext. C
filterContextD Q
)Q R
{ 	
CustomClaim 
( 
$str *
,* +
filterContext, 9
.9 :
	RouteData: C
)C D
;D E
} 	
public 
override 
async 
Task ""
OnActionExecutionAsync# 9
(9 :"
ActionExecutingContext: P
filterContextQ ^
,^ _#
ActionExecutionDelegate` w
nextx |
)| }
{ 	
var   
accessToken   
=   
await   #
filterContext  $ 1
.  1 2
HttpContext  2 =
.  = >
GetTokenAsync  > K
(  K L
$str  L Z
)  Z [
;  [ \
bool!! 
	isApiCall!! 
=!! 
false!! "
;!!" #
if## 
(## 
accessToken## 
==## 
null## #
)### $
{$$ 
var%% 
urlPath%% 
=%% 
string%% $
.%%$ %
Empty%%% *
;%%* +
string'' 
authorizationToken'' )
=''* +
filterContext'', 9
.''9 :
HttpContext'': E
.''E F
Request''F M
.''M N
Headers''N U
[''U V
$str''V e
]''e f
;''f g
if)) 
()) 
filterContext)) !
.))! "
HttpContext))" -
.))- .
Request)). 5
.))5 6
Path))6 :
.)): ;
HasValue)); C
)))C D
{** 
urlPath++ 
=++ 
filterContext++ +
.+++ ,
HttpContext++, 7
.++7 8
Request++8 ?
.++? @
Path++@ D
.++D E
Value++E J
;++J K
if,, 
(,, 
urlPath,, 
.,,  
Contains,,  (
(,,( )
$str,,) .
),,. /
),,/ 0
{-- 
	isApiCall.. !
=.." #
true..$ (
;..( )
}// 
}00 
if22 
(22 
authorizationToken22 &
==22' )
null22* .
)22. /
{33 
filterContext44 !
.44! "
Result44" (
=44) *
new44+ .!
RedirectToRouteResult44/ D
(44D E
new44E H 
RouteValueDictionary44I ]
(44] ^
new44^ a
{55 

controller66 "
=66# $
filterContext66% 2
.662 3
	RouteData663 <
.66< =
Values66= C
[66C D
$str66D P
]66P Q
,66Q R
action77 
=77  
filterContext77! .
.77. /
	RouteData77/ 8
.778 9
Values779 ?
[77? @
$str77@ H
]77H I
,77I J
id88 
=88 
filterContext88 *
.88* +
	RouteData88+ 4
.884 5
Values885 ;
[88; <
$str88< @
]88@ A
}99 
)99 
)99 
;99 
}:: 
else;; 
{<< 
string== 
[== 
]== 
authorsList== (
===) *
authorizationToken==+ =
.=== >
Split==> C
(==C D
$str==D G
)==G H
;==H I
accessToken>> 
=>>  !
authorsList>>" -
[>>- .
$num>>. /
]>>/ 0
;>>0 1
}?? 
}@@ 
ifBB 
(BB 
accessTokenBB 
!=BB 
nullBB #
)BB# $
{CC 
varDD 
userIdDD 
=DD 
filterContextDD *
.DD* +
HttpContextDD+ 6
.DD6 7
UserDD7 ;
.DD; <
ClaimsDD< B
.DDB C
CountDDC H
(DDH I
)DDI J
!=DDK M
$numDDN O
?DDP Q
filterContextDDR _
.DD_ `
HttpContextDD` k
.DDk l
UserDDl p
.DDp q
	FindFirstDDq z
(DDz {

ClaimTypes	DD{ Ö
.
DDÖ Ü
NameIdentifier
DDÜ î
)
DDî ï
.
DDï ñ
Value
DDñ õ
:
DDú ù
null
DDû ¢
;
DD¢ £
HttpClientHandlerGG !
handlerGG" )
=GG* +
newGG, /
HttpClientHandlerGG0 A
{HH 5
)ServerCertificateCustomValidationCallbackII =
=II> ?
(II@ A
httpRequestMessageIIA S
,IIS T
certIIU Y
,IIY Z
cetChainII[ c
,IIc d
policyErrorsIIe q
)IIq r
=>IIs u
{IIv w
returnIIx ~
true	II É
;
IIÉ Ñ
}
IIÖ Ü
}JJ 
;JJ 

HttpClientLL 
clientLL !
=LL" #
StartupLL$ +
.LL+ ,
islocalhostLL, 7
?LL8 9
newLL: =

HttpClientLL> H
(LLH I
handlerLLI P
)LLP Q
:LLR S
newLLT W

HttpClientLLX b
(LLb c
)LLc d
;LLd e
clientOO 
.OO !
DefaultRequestHeadersOO ,
.OO, -
AuthorizationOO- :
=OO; <
newOO= @%
AuthenticationHeaderValueOOA Z
(OOZ [
$strOO[ c
,OOc d
accessTokenOOe p
)OOp q
;OOq r
varQQ 
	urlstringQQ 
=QQ 
StartupQQ  '
.QQ' (
IdentityServerURLQQ( 9
+QQ: ;
ConstantHelperQQ< J
.QQJ K,
 VALIDATE_CLIENT_USER_MAPPING_URLQQK k
;QQk l
varRR 
objRR 
=RR 
newRR 
{RR 
UserIdRR  &
=RR' (
userIdRR) /
,RR/ 0
ClaimRR1 6
=RR7 8
StartupRR9 @
.RR@ A
ClientIdRRA I
}RRJ K
;RRK L
varTT 
jsonTT 
=TT 
JsonConvertTT &
.TT& '
SerializeObjectTT' 6
(TT6 7
objTT7 :
)TT: ;
;TT; <
StringContentUU 
dataUU "
=UU# $
newUU% (
StringContentUU) 6
(UU6 7
jsonUU7 ;
,UU; <
EncodingUU= E
.UUE F
UTF8UUF J
,UUJ K
$strUUL ^
)UU^ _
;UU_ `
varWW 
responseWW 
=WW 
awaitWW $
clientWW% +
.WW+ ,
	PostAsyncWW, 5
(WW5 6
	urlstringWW6 ?
,WW? @
dataWWA E
)WWE F
;WWF G
varXX 
responseModelStringXX '
=XX( )
awaitXX* /
responseXX0 8
.XX8 9
ContentXX9 @
.XX@ A
ReadAsStringAsyncXXA R
(XXR S
)XXS T
;XXT U
varYY 
apiResponseYY 
=YY  !
(YY" #
ApiResponseYY# .
)YY. /
(YY/ 0
(YY0 1

NewtonsoftYY1 ;
.YY; <
JsonYY< @
.YY@ A
LinqYYA E
.YYE F
JObjectYYF M
)YYM N

NewtonsoftYYN X
.YYX Y
JsonYYY ]
.YY] ^
JsonConvertYY^ i
.YYi j
DeserializeObjectYYj {
(YY{ | 
responseModelString	YY| è
)
YYè ê
)
YYê ë
.
YYë í
ToObjectZZ  
(ZZ  !
typeofZZ! '
(ZZ' (
ApiResponseZZ( 3
)ZZ3 4
)ZZ4 5
;ZZ5 6
if\\ 
(\\ 
apiResponse\\ 
.\\  
status\\  &
==\\' )
ConstantHelper\\* 8
.\\8 9
APIState\\9 A
.\\A B
SUCCESS\\B I
.\\I J
ToString\\J R
(\\R S
)\\S T
)\\T U
{]] 
if^^ 
(^^ 
apiResponse^^ #
.^^# $
apiStatusCode^^$ 1
==^^2 4
APIStatusCode^^5 B
.^^B C
UNAUTHORIZED^^C O
&&^^P R
!^^S T
	isApiCall^^T ]
)^^] ^
{__ 
filterContext`` %
.``% &
Result``& ,
=``- .
new``/ 2!
RedirectToRouteResult``3 H
(``H I
new``I L 
RouteValueDictionary``M a
(``a b
new``b e
{``f g

controller``h r
=``s t
$str``u }
,``} ~
action	`` Ö
=
``Ü á
$str
``à ê
}
``ë í
)
``í ì
)
``ì î
;
``î ï
}aa 
elsebb 
{cc 
ifdd 
(dd 
!dd 
	isApiCalldd &
)dd& '
{ee 
varff 
lastLoginUserIdff  /
=ff0 1
filterContextff2 ?
.ff? @
HttpContextff@ K
.ffK L
SessionffL S
.ffS T
	GetStringffT ]
(ff] ^
$strff^ o
)ffo p
;ffp q
ifgg 
(gg  
!gg  !
stringgg! '
.gg' (
IsNullOrEmptygg( 5
(gg5 6
lastLoginUserIdgg6 E
)ggE F
&&ggG I
lastLoginUserIdggJ Y
!=ggZ \
userIdgg] c
)ggc d
{hh 
filterContextii  -
.ii- .
HttpContextii. 9
.ii9 :
Sessionii: A
.iiA B
SetInt32iiB J
(iiJ K
$striiK ]
,ii] ^
$numii_ `
)ii` a
;iia b
}jj 
filterContextkk )
.kk) *
HttpContextkk* 5
.kk5 6
Sessionkk6 =
.kk= >
	SetStringkk> G
(kkG H
$strkkH Y
,kkY Z
userIdkk[ a
)kka b
;kkb c
}ll 
CustomClaimnn #
(nn# $
$strnn$ 7
,nn7 8
filterContextnn9 F
.nnF G
	RouteDatannG P
)nnP Q
;nnQ R
awaitoo 
nextoo "
(oo" #
)oo# $
;oo$ %
}pp 
}qq 
elserr 
{ss 
iftt 
(tt 
	isApiCalltt !
)tt! "
{uu 
ifww 
(ww 
apiResponseww '
.ww' (
dataww( ,
!=ww- /
nullww0 4
&&ww5 7
apiResponseww8 C
.wwC D
datawwD H
.wwH I
ToStringwwI Q
(wwQ R
)wwR S
==wwT V
$strwwW h
)wwh i
{xx 
CustomClaimyy '
(yy' (
$stryy( ;
,yy; <
filterContextyy= J
.yyJ K
	RouteDatayyK T
)yyT U
;yyU V
awaitzz !
nextzz" &
(zz& '
)zz' (
;zz( )
}{{ 
else|| 
{}} 
var~~ !
dynamicMessageService~~  5
=~~6 7
(~~8 9"
IDynamicMessageService~~9 O
)~~O P
filterContext~~P ]
.~~] ^
HttpContext~~^ i
.~~i j
RequestServices~~j y
.~~y z

GetService	~~z Ñ
(
~~Ñ Ö
typeof
~~Ö ã
(
~~ã å$
IDynamicMessageService
~~å ¢
)
~~¢ £
)
~~£ §
;
~~§ •
var 
accessDeniedMSG  /
=0 1
await2 7!
dynamicMessageService8 M
.M N
GetN Q
(Q R
POPUP_ACCESS_DENIEDR e
)e f
;f g
ApiResponse
ÄÄ '
res
ÄÄ( +
=
ÄÄ, -
new
ÄÄ. 1
ApiResponse
ÄÄ2 =
(
ÄÄ= >
)
ÄÄ> ?
{
ÅÅ 
apiStatusCode
ÇÇ  -
=
ÇÇ. /
APIStatusCode
ÇÇ0 =
.
ÇÇ= >
ERROR
ÇÇ> C
,
ÇÇC D
status
ÉÉ  &
=
ÉÉ' (
APIState
ÉÉ) 1
.
ÉÉ1 2
FAILED
ÉÉ2 8
.
ÉÉ8 9
GetDisplayValue
ÉÉ9 H
(
ÉÉH I
)
ÉÉI J
,
ÉÉJ K
userMessage
ÑÑ  +
=
ÑÑ, -
new
ÑÑ. 1
UserMessage
ÑÑ2 =
{
ÑÑ> ?
messageContent
ÑÑ@ N
=
ÑÑO P
new
ÑÑQ T
MessageContent
ÑÑU c
{
ÑÑd e
messageType
ÑÑf q
=
ÑÑr s
accessDeniedMSGÑÑt É
.ÑÑÉ Ñ
messageTypeÑÑÑ è
,ÑÑè ê
messageCodeÑÑë ú
=ÑÑù û
accessDeniedMSGÑÑü Æ
.ÑÑÆ Ø
messageCodeÑÑØ ∫
,ÑÑ∫ ª
messageÑÑº √
=ÑÑƒ ≈
stringÑÑ∆ Ã
.ÑÑÃ Õ
FormatÑÑÕ ”
(ÑÑ” ‘
accessDeniedMSGÑÑ‘ „
.ÑÑ„ ‰
messageÑÑ‰ Î
,ÑÑÎ Ï
PROJECT_NAMEÑÑÌ ˘
)ÑÑ˘ ˙
}ÑÑ˚ ¸
}ÑÑ˝ ˛
}
ÖÖ 
;
ÖÖ 
filterContext
ÜÜ )
.
ÜÜ) *
Result
ÜÜ* 0
=
ÜÜ1 2
new
ÜÜ3 6
OkObjectResult
ÜÜ7 E
(
ÜÜE F
res
ÜÜF I
)
ÜÜI J
;
ÜÜJ K
}
áá 
}
àà 
else
ââ 
{
ää 
if
åå 
(
åå 
apiResponse
åå '
.
åå' (
data
åå( ,
!=
åå- /
null
åå0 4
&&
åå5 7
apiResponse
åå8 C
.
ååC D
data
ååD H
.
ååH I
ToString
ååI Q
(
ååQ R
)
ååR S
==
ååT V
$str
ååW h
)
ååh i
{
çç 
filterContext
éé )
.
éé) *
Result
éé* 0
=
éé1 2
new
éé3 6#
RedirectToRouteResult
éé7 L
(
ééL M
new
ééM P"
RouteValueDictionary
ééQ e
(
éée f
new
ééf i
{
ééj k

controller
éél v
=
ééw x
$strééy Å
,ééÅ Ç
actionééÉ â
=ééä ã
$strééå î
}ééï ñ
)ééñ ó
)ééó ò
;ééò ô
}
èè 
else
êê 
{
ëë 
filterContext
íí )
.
íí) *
Result
íí* 0
=
íí1 2
new
íí3 6#
RedirectToRouteResult
íí7 L
(
ííL M
new
ííM P"
RouteValueDictionary
ííQ e
(
ííe f
new
ííf i
{
ííj k

controller
ííl v
=
ííw x
$strííy Ñ
,ííÑ Ö
actionííÜ å
=ííç é
$strííè ù
}ííû ü
)ííü †
)íí† °
;íí° ¢
}
ìì 
}
îî 
}
ïï 
}
ññ 
}
óó 	
public
ôô 
override
ôô 
void
ôô 
OnResultExecuted
ôô -
(
ôô- .#
ResultExecutedContext
ôô. C
filterContext
ôôD Q
)
ôôQ R
{
öö 	
CustomClaim
õõ 
(
õõ 
$str
õõ *
,
õõ* +
filterContext
õõ, 9
.
õõ9 :
	RouteData
õõ: C
)
õõC D
;
õõD E
}
úú 	
public
ûû 
override
ûû 
void
ûû 
OnResultExecuting
ûû .
(
ûû. /$
ResultExecutingContext
ûû/ E
filterContext
ûûF S
)
ûûS T
{
üü 	
CustomClaim
†† 
(
†† 
$str
†† ,
,
††, -
filterContext
††. ;
.
††; <
	RouteData
††< E
)
††E F
;
††F G
}
°° 	
private
££ 
void
££ 
CustomClaim
££  
(
££  !
string
££! '

methodName
££( 2
,
££2 3
	RouteData
££4 =
	routeData
££> G
)
££G H
{
§§ 	
var
•• 
controllerName
•• 
=
••  
	routeData
••! *
.
••* +
Values
••+ 1
[
••1 2
$str
••2 >
]
••> ?
;
••? @
var
¶¶ 

actionName
¶¶ 
=
¶¶ 
	routeData
¶¶ &
.
¶¶& '
Values
¶¶' -
[
¶¶- .
$str
¶¶. 6
]
¶¶6 7
;
¶¶7 8
var
ßß 
message
ßß 
=
ßß 
String
ßß  
.
ßß  !
Format
ßß! '
(
ßß' (
$str
ßß( H
,
ßßH I

methodName
ßßJ T
,
ßßT U
controllerName
®®H V
,
®®V W

actionName
©©H R
)
©©R S
;
©©S T
}
™™ 	
}
´´ 
}¨¨ ∂¿
OD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\DesignerController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
[ 
CustomAuthorization 
] 
public 

class 
DesignerController #
:$ %
BaseController& 4
{ 
private   
readonly   
ConnectionStrings   *
_connectionStrings  + =
;  = >
private!! 
readonly!! $
IHttpsResponseRepository!! 1%
_iHttpsResponseRepository!!2 K
;!!K L
private"" 
readonly"" 
ILogger""  
<""  !
DesignerController""! 3
>""3 4
_logger""5 <
;""< =
private## 
readonly## 
IUtilityController## +
_utilityController##, >
;##> ?
private$$ 
readonly$$ "
IDynamicMessageService$$ /"
_dynamicMessageService$$0 F
;$$F G
static&& 
DesignerController&& !
(&&! "
)&&" #
{'' 	

Stimulsoft)) 
.)) 
Base)) 
.)) 

StiLicense)) &
.))& '
LoadFromFile))' 3
())3 4
$str))4 A
)))A B
;))B C
}** 	
public++ 
DesignerController++ !
(++! "
FJTSqlDBContext++" 1
fjtSqlDBContext++2 A
,++A B$
IHttpsResponseRepository++C [$
iHttpsResponseRepository++\ t
,++t u
IOptions++v ~
<++~ 
ConstantPath	++ ã
>
++ã å
constantPath
++ç ô
,
++ô ö
IOptions
++õ £
<
++£ §
ConnectionStrings
++§ µ
>
++µ ∂
connectionStrings
++∑ »
,
++» …
ILogger
++  —
<
++— “ 
DesignerController
++“ ‰
>
++‰ Â
logger
++Ê Ï
,
++Ï Ì 
IUtilityController
++Ó Ä
utilityController
++Å í
,
++í ì$
IDynamicMessageService
++î ™#
dynamicMessageService
++´ ¿
)
++¿ ¡
:
++¬ √
base
++ƒ »
(
++» …
fjtSqlDBContext
++… ÿ
,
++ÿ Ÿ
constantPath
++⁄ Ê
)
++Ê Á
{,, 	
_constantPath-- 
=-- 
constantPath-- (
.--( )
Value--) .
;--. /%
_iHttpsResponseRepository.. %
=..& '$
iHttpsResponseRepository..( @
;..@ A
_connectionStrings// 
=//  
connectionStrings//! 2
.//2 3
Value//3 8
;//8 9
_logger00 
=00 
logger00 
;00 
_utilityController11 
=11  
utilityController11! 2
;112 3"
_dynamicMessageService22 "
=22# $!
dynamicMessageService22% :
;22: ;
}33 	
[:: 	
	Authorize::	 
]:: 
public;; 
async;; 
Task;; 
<;; 
IActionResult;; '
>;;' (
Index;;) .
(;;. /
string;;/ 5
id;;6 8
);;8 9
{<< 	
if== 
(== 
id== 
==== 
null== 
)== 
{>> 
return?? 
View?? 
(?? 
$str?? %
)??% &
;??& '
}@@ 
tryAA 
{BB 
varCC 
reportModelCC 
=CC  !
newCC" %
SaveReportModelCC& 5
(CC5 6
)CC6 7
;CC7 8
varDD 

reportDataDD 
=DD  
awaitDD! &
_FJTSqlDBContextDD' 7
.DD7 8
reportmasterDD8 D
.DDD E
FirstOrDefaultAsyncDDE X
(DDX Y
xDDY Z
=>DD[ ]
xDD^ _
.DD_ `
fileNameDD` h
==DDi k
idDDl n
&&DDo q
xDDr s
.DDs t
	isDeletedDDt }
==	DD~ Ä
false
DDÅ Ü
)
DDÜ á
;
DDá à
ifEE 
(EE 

reportDataEE 
==EE !
nullEE" &
)EE& '
{FF 
varGG 
notFoundMSGGG #
=GG$ %
awaitGG& +"
_dynamicMessageServiceGG, B
.GGB C
GetGGC F
(GGF G
	NOT_FOUNDGGG P
)GGP Q
;GGQ R
returnHH 
ViewHH 
(HH  
$strHH  '
,HH' (
newHH) ,
ErrorViewModelHH- ;
{HH< =

StatusCodeHH> H
=HHI J
(HHK L
intHHL O
)HHO P
APIStatusCodeHHP ]
.HH] ^
PAGE_NOT_FOUNDHH^ l
,HHl m
MessageHHn u
=HHv w
stringHHx ~
.HH~ 
Format	HH Ö
(
HHÖ Ü
notFoundMSG
HHÜ ë
.
HHë í
message
HHí ô
,
HHô ö
REPORT_DETAILS
HHõ ©
)
HH© ™
}
HH´ ¨
)
HH¨ ≠
;
HH≠ Æ
}II 
stringJJ 
reportCretatedByJJ '
=JJ( )
	GetUserIdJJ* 3
(JJ3 4
)JJ4 5
;JJ5 6
ifKK 
(KK 
(KK 
reportCretatedByKK %
==KK& (
nullKK) -
)KK- .
||KK/ 1
(KK2 3
reportCretatedByKK3 C
!=KKD F

reportDataKKG Q
.KKQ R
	createdByKKR [
)KK[ \
)KK\ ]
{LL 
returnMM 
RedirectToActionMM +
(MM+ ,
$strMM, :
,MM: ;
$strMM< G
)MMG H
;MMH I
}NN 
boolPP 
isDraftPP 
=PP 

reportDataPP )
.PP) *
statusPP* 0
==PP1 3
ReportStatusPP4 @
.PP@ A
DraftPPA F
.PPF G
GetDisplayValuePPG V
(PPV W
)PPW X
;PPX Y
varSS 
fileNameSS 
=SS 
(SS  
isDraftSS  '
&&SS( *

reportDataSS+ 5
.SS5 6
draftFileNameSS6 C
!=SSD F
nullSSG K
)SSK L
?SSM N

reportDataSSO Y
.SSY Z
draftFileNameSSZ g
:SSh i

reportDataSSj t
.SSt u
fileNameSSu }
;SS} ~
varTT 
responseModelTT !
=TT" #
_utilityControllerTT$ 6
.TT6 7#
CheckStatusOfReportFileTT7 N
(TTN O
fileNameTTO W
,TTW X

reportDataTTY c
.TTc d
isEndUserReportTTd s
==TTt v
trueTTw {
,TT{ |

reportData	TT} á
.
TTá à"
reportGenerationType
TTà ú
)
TTú ù
;
TTù û
ifVV 
(VV 
responseModelVV !
.VV! "
	IsSuccessVV" +
==VV, .
falseVV/ 4
||VV5 7
(VV8 9
boolVV9 =
)VV= >
responseModelVV> K
.VVK L
ModelVVL Q
==VVR T
falseVVU Z
)VVZ [
{WW 
varXX 
notFoundMSGXX #
=XX$ %
awaitXX& +"
_dynamicMessageServiceXX, B
.XXB C
GetXXC F
(XXF G
	NOT_FOUNDXXG P
)XXP Q
;XXQ R
returnYY 
ViewYY 
(YY  
$strYY  '
,YY' (
newYY) ,
ErrorViewModelYY- ;
{YY< =

StatusCodeYY> H
=YYI J
(YYK L
intYYL O
)YYO P
APIStatusCodeYYP ]
.YY] ^
PAGE_NOT_FOUNDYY^ l
,YYl m
MessageYYn u
=YYv w
stringYYx ~
.YY~ 
Format	YY Ö
(
YYÖ Ü
notFoundMSG
YYÜ ë
.
YYë í
message
YYí ô
,
YYô ö
REPORT_ENTITY
YYõ ®
)
YY® ©
}
YY™ ´
)
YY´ ¨
;
YY¨ ≠
}ZZ 
reportModel\\ 
.\\ 

ReportGUID\\ &
=\\' (
id\\) +
;\\+ ,
reportModel]] 
.]] 

ReportName]] &
=]]' (

reportData]]) 3
.]]3 4

reportName]]4 >
;]]> ?
reportModel^^ 
.^^ 
PublishVersion^^ *
=^^+ ,

reportData^^- 7
.^^7 8
reportVersion^^8 E
;^^E F
reportModel__ 
.__ 
ReportStatus__ (
=__) *

reportData__+ 5
.__5 6
status__6 <
==__= ?
ReportStatus__@ L
.__L M
Draft__M R
.__R S
GetDisplayValue__S b
(__b c
)__c d
?__e f
ReportStatus__g s
.__s t
Draft__t y
.__y z
ToString	__z Ç
(
__Ç É
)
__É Ñ
:
__Ö Ü
ReportStatus
__á ì
.
__ì î
	Published
__î ù
.
__ù û
ToString
__û ¶
(
__¶ ß
)
__ß ®
;
__® ©
ViewBag`` 
.`` 
	UiPageURL`` !
=``" #
_constantPath``$ 1
.``1 2
	UiPageUrl``2 ;
;``; <
ViewBagaa 
.aa #
printReportDataInHeaderaa /
=aa0 1
trueaa2 6
;aa6 7
varcc 
somethingWrongMSGcc %
=cc& '
awaitcc( -"
_dynamicMessageServicecc. D
.ccD E
GetccE H
(ccH I
SOMTHING_WRONGccI W
)ccW X
;ccX Y
vardd 
discardDraftMSGdd #
=dd$ %
awaitdd& +"
_dynamicMessageServicedd, B
.ddB C
GetddC F
(ddF G!
DISCARD_DRAFT_CHANGESddG \
)dd\ ]
;dd] ^
varee 
stopActivityMSGee #
=ee$ %
awaitee& +"
_dynamicMessageServiceee, B
.eeB C
GeteeC F
(eeF G!
CONFIRM_STOP_ACTIVITYeeG \
)ee\ ]
;ee] ^
ViewBagff 
.ff 
somethingWrongMSGff )
=ff* +
somethingWrongMSGff, =
.ff= >
messageff> E
;ffE F
ViewBaggg 
.gg 
discardDraftMSGgg '
=gg( )
discardDraftMSGgg* 9
.gg9 :
messagegg: A
;ggA B
ViewBaghh 
.hh 
stopActivityMSGhh '
=hh( )
stopActivityMSGhh* 9
.hh9 :
messagehh: A
;hhA B
ViewBagii 
.ii 
urlParameterii $
=ii% &
idii' )
;ii) *
returnjj 
Viewjj 
(jj 
reportModeljj '
)jj' (
;jj( )
}kk 
catchll 
(ll 
	Exceptionll 
ell 
)ll 
{mm 
_loggernn 
.nn 
LogErrornn  
(nn  !
enn! "
.nn" #
ToStringnn# +
(nn+ ,
)nn, -
)nn- .
;nn. /
returnoo 
Viewoo 
(oo 
$stroo #
,oo# $
newoo% (
ErrorViewModeloo) 7
{oo8 9

StatusCodeoo: D
=ooE F
(ooG H
intooH K
)ooK L
APIStatusCodeooL Y
.ooY Z!
INTERNAL_SERVER_ERRORooZ o
,ooo p
Messageooq x
=ooy z
eoo{ |
.oo| }
Message	oo} Ñ
}
ooÖ Ü
)
ooÜ á
;
ooá à
}pp 
}qq 	
[xx 	
	Authorizexx	 
]xx 
publicyy 
asyncyy 
Taskyy 
<yy 
IActionResultyy '
>yy' (
	GetReportyy) 2
(yy2 3
stringyy3 9
idyy: <
)yy< =
{zz 	
try{{ 
{|| 
var}} 

reportData}} 
=}}  
await}}! &
_FJTSqlDBContext}}' 7
.}}7 8
reportmaster}}8 D
.}}D E
FirstOrDefaultAsync}}E X
(}}X Y
x}}Y Z
=>}}[ ]
x}}^ _
.}}_ `
fileName}}` h
==}}i k
id}}l n
&&}}o q
x}}r s
.}}s t
	isDeleted}}t }
==	}}~ Ä
false
}}Å Ü
)
}}Ü á
;
}}á à
var~~ 
fileName~~ 
=~~ 
(~~  
(~~  !

reportData~~! +
.~~+ ,
status~~, 2
==~~3 5
ReportStatus~~6 B
.~~B C
Draft~~C H
.~~H I
GetDisplayValue~~I X
(~~X Y
)~~Y Z
)~~Z [
&&~~\ ^

reportData~~_ i
.~~i j
draftFileName~~j w
!=~~x z
null~~{ 
)	~~ Ä
?
~~Å Ç

reportData
~~É ç
.
~~ç é
draftFileName
~~é õ
:
~~ú ù

reportData
~~û ®
.
~~® ©
fileName
~~© ±
;
~~± ≤
var
ÄÄ 
responseModel
ÄÄ !
=
ÄÄ" #
await
ÄÄ$ ) 
_utilityController
ÄÄ* <
.
ÄÄ< =
GetReportByteData
ÄÄ= N
(
ÄÄN O
fileName
ÄÄO W
,
ÄÄW X

reportData
ÄÄY c
.
ÄÄc d
isEndUserReport
ÄÄd s
==
ÄÄt v
true
ÄÄw {
,
ÄÄ{ |

reportDataÄÄ} á
.ÄÄá à$
reportGenerationTypeÄÄà ú
)ÄÄú ù
;ÄÄù û
ReportByteDataVM
ÅÅ  
reportByteDataVM
ÅÅ! 1
=
ÅÅ2 3
(
ÅÅ4 5
ReportByteDataVM
ÅÅ5 E
)
ÅÅE F
(
ÅÅF G
(
ÅÅG H

Newtonsoft
ÅÅH R
.
ÅÅR S
Json
ÅÅS W
.
ÅÅW X
Linq
ÅÅX \
.
ÅÅ\ ]
JObject
ÅÅ] d
)
ÅÅd e

Newtonsoft
ÅÅe o
.
ÅÅo p
Json
ÅÅp t
.
ÅÅt u
JsonConvertÅÅu Ä
.ÅÅÄ Å!
DeserializeObjectÅÅÅ í
(ÅÅí ì
responseModelÅÅì †
.ÅÅ† °
ModelÅÅ° ¶
.ÅÅ¶ ß
ToStringÅÅß Ø
(ÅÅØ ∞
)ÅÅ∞ ±
)ÅÅ± ≤
)ÅÅ≤ ≥
.ÅÅ≥ ¥
ToObject
ÇÇ  
(
ÇÇ  !
typeof
ÇÇ! '
(
ÇÇ' (
ReportByteDataVM
ÇÇ( 8
)
ÇÇ8 9
)
ÇÇ9 :
;
ÇÇ: ;
var
ÉÉ 
reportByteData
ÉÉ "
=
ÉÉ# $
reportByteDataVM
ÉÉ% 5
.
ÉÉ5 6
ReportByteData
ÉÉ6 D
;
ÉÉD E
var
ÜÜ 
report
ÜÜ 
=
ÜÜ 
new
ÜÜ  
	StiReport
ÜÜ! *
(
ÜÜ* +
)
ÜÜ+ ,
;
ÜÜ, -
report
áá 
.
áá 
Load
áá 
(
áá 
reportByteData
áá *
)
áá* +
;
áá+ ,
var
àà 

dictionary
àà 
=
àà  
report
àà! '
.
àà' (

Dictionary
àà( 2
;
àà2 3
report
ää 
.
ää 

ReportName
ää !
=
ää" #

reportData
ää$ .
.
ää. /

reportName
ää/ 9
;
ää9 :
foreach
åå 
(
åå 
var
åå 
variableName
åå )
in
åå* ,
Enum
åå- 1
.
åå1 2
GetNames
åå2 :
(
åå: ;
typeof
åå; A
(
ååA B$
ConstantReportVariable
ååB X
)
ååX Y
)
ååY Z
)
ååZ [
{
çç 
if
éé 
(
éé 
report
éé 
.
éé 
IsVariableExist
éé .
(
éé. /
variableName
éé/ ;
)
éé; <
)
éé< =
{
èè $
ConstantReportVariable
êê .
reportVariable
êê/ =
=
êê> ?
(
êê@ A$
ConstantReportVariable
êêA W
)
êêW X
Enum
êêX \
.
êê\ ]
Parse
êê] b
(
êêb c
typeof
êêc i
(
êêi j%
ConstantReportVariableêêj Ä
)êêÄ Å
,êêÅ Ç
variableNameêêÉ è
)êêè ê
;êêê ë

dictionary
ëë "
.
ëë" #
	Variables
ëë# ,
[
ëë, -
variableName
ëë- 9
]
ëë9 :
.
ëë: ;
Value
ëë; @
=
ëëA B
reportVariable
ëëC Q
.
ëëQ R
GetDisplayValue
ëëR a
(
ëëa b
)
ëëb c
;
ëëc d
}
íí 
}
ìì 
var
ññ 
dbList
ññ 
=
ññ 
report
ññ #
.
ññ# $

Dictionary
ññ$ .
.
ññ. /
	Databases
ññ/ 8
.
ññ8 9
ToList
ññ9 ?
(
ññ? @
)
ññ@ A
;
ññA B
for
óó 
(
óó 
int
óó 
i
óó 
=
óó 
$num
óó 
;
óó 
i
óó  !
<
óó" #
dbList
óó$ *
.
óó* +
Count
óó+ 0
;
óó0 1
i
óó2 3
++
óó3 5
)
óó5 6
{
òò 
(
ôô 
(
ôô 
StiSqlDatabase
ôô $
)
ôô$ %

dictionary
ôô% /
.
ôô/ 0
	Databases
ôô0 9
[
ôô9 :
i
ôô: ;
]
ôô; <
)
ôô< =
.
ôô= >
ConnectionString
ôô> N
=
ôôO P 
_connectionStrings
ôôQ c
.
ôôc d
ReportConnection
ôôd t
;
ôôt u
}
öö 
if
ùù 
(
ùù 
report
ùù 
.
ùù 
IsVariableExist
ùù *
(
ùù* +
PARA_REPORT_TITLE
ùù+ <
)
ùù< =
)
ùù= >
{
ûû 

dictionary
üü 
.
üü 
	Variables
üü (
[
üü( )
PARA_REPORT_TITLE
üü) :
]
üü: ;
.
üü; <
Value
üü< A
=
üüB C

reportData
üüD N
.
üüN O
reportTitle
üüO Z
;
üüZ [
}
†† 
if
°° 
(
°° 
report
°° 
.
°° 
IsVariableExist
°° *
(
°°* +!
PARA_REPORT_VERSION
°°+ >
)
°°> ?
)
°°? @
{
¢¢ 

dictionary
££ 
.
££ 
	Variables
££ (
[
££( )!
PARA_REPORT_VERSION
££) <
]
££< =
.
££= >
Value
££> C
=
££D E

reportData
££F P
.
££P Q
reportVersion
££Q ^
??
££_ a
$str
££b e
;
££e f
}
§§ 
if
•• 
(
•• 
report
•• 
.
•• 
IsVariableExist
•• *
(
••* +*
Para_ImageFolderPathFor_ROHS
••+ G
)
••G H
)
••H I
{
¶¶ 

dictionary
ßß 
.
ßß 
	Variables
ßß (
[
ßß( )*
Para_ImageFolderPathFor_ROHS
ßß) E
]
ßßE F
.
ßßF G
Value
ßßG L
=
ßßM N
string
ßßO U
.
ßßU V
Concat
ßßV \
(
ßß\ ]
_constantPath
ßß] j
.
ßßj k
APIURL
ßßk q
,
ßßq r
_constantPathßßs Ä
.ßßÄ Å
RoHSImagesPathßßÅ è
)ßßè ê
;ßßê ë
}
®® 
return
™™  
StiNetCoreDesigner
™™ )
.
™™) *
GetReportResult
™™* 9
(
™™9 :
this
™™: >
,
™™> ?
report
™™@ F
)
™™F G
;
™™G H
}
´´ 
catch
¨¨ 
(
¨¨ 
	Exception
¨¨ 
e
¨¨ 
)
¨¨ 
{
≠≠ 
_logger
ÆÆ 
.
ÆÆ 
LogError
ÆÆ  
(
ÆÆ  !
e
ÆÆ! "
.
ÆÆ" #
ToString
ÆÆ# +
(
ÆÆ+ ,
)
ÆÆ, -
)
ÆÆ- .
;
ÆÆ. /
return
ØØ 
View
ØØ 
(
ØØ 
$str
ØØ #
,
ØØ# $
new
ØØ% (
ErrorViewModel
ØØ) 7
{
ØØ8 9

StatusCode
ØØ: D
=
ØØE F
(
ØØG H
int
ØØH K
)
ØØK L
APIStatusCode
ØØL Y
.
ØØY Z#
INTERNAL_SERVER_ERROR
ØØZ o
,
ØØo p
Message
ØØq x
=
ØØy z
e
ØØ{ |
.
ØØ| }
MessageØØ} Ñ
}ØØÖ Ü
)ØØÜ á
;ØØá à
}
∞∞ 
}
±± 	
[
∑∑ 	
	Authorize
∑∑	 
]
∑∑ 
public
∏∏ 
async
∏∏ 
Task
∏∏ 
<
∏∏ 
IActionResult
∏∏ '
>
∏∏' (
DesignerEvent
∏∏) 6
(
∏∏6 7
)
∏∏7 8
{
ππ 	
return
∫∫ 
await
∫∫  
StiNetCoreDesigner
∫∫ +
.
∫∫+ ,&
DesignerEventResultAsync
∫∫, D
(
∫∫D E
this
∫∫E I
)
∫∫I J
;
∫∫J K
}
ªª 	
public
¡¡ 
async
¡¡ 
Task
¡¡ 
<
¡¡ 
IActionResult
¡¡ '
>
¡¡' (
PreviewReport
¡¡) 6
(
¡¡6 7
)
¡¡7 8
{
¬¬ 	
	StiReport
√√ 
report
√√ 
=
√√  
StiNetCoreDesigner
√√ 1
.
√√1 2#
GetActionReportObject
√√2 G
(
√√G H
this
√√H L
)
√√L M
;
√√M N
return
ƒƒ 
await
ƒƒ  
StiNetCoreDesigner
ƒƒ +
.
ƒƒ+ ,&
PreviewReportResultAsync
ƒƒ, D
(
ƒƒD E
this
ƒƒE I
,
ƒƒI J
report
ƒƒK Q
)
ƒƒQ R
;
ƒƒR S
}
≈≈ 	
[
ÀÀ 	
	Authorize
ÀÀ	 
]
ÀÀ 
public
ÃÃ 
async
ÃÃ 
Task
ÃÃ 
<
ÃÃ 
IActionResult
ÃÃ '
>
ÃÃ' (

SaveReport
ÃÃ) 3
(
ÃÃ3 4
)
ÃÃ4 5
{
ÕÕ 	
var
œœ 
report
œœ 
=
œœ  
StiNetCoreDesigner
œœ +
.
œœ+ ,
GetReportObject
œœ, ;
(
œœ; <
this
œœ< @
)
œœ@ A
;
œœA B
var
—— 
fileByte
—— 
=
—— 
report
—— !
.
——! "
SaveToByteArray
——" 1
(
——1 2
)
——2 3
;
——3 4
HttpContext
‘‘ 
.
‘‘ 
Session
‘‘ 
.
‘‘  
Set
‘‘  #
(
‘‘# $
$str
‘‘$ 8
,
‘‘8 9
fileByte
‘‘: B
)
‘‘B C
;
‘‘C D
return
’’ 
await
’’  
StiNetCoreDesigner
’’ +
.
’’+ ,#
SaveReportResultAsync
’’, A
(
’’A B
this
’’B F
)
’’F G
;
’’G H
}
÷÷ 	
[
›› 	
HttpPost
››	 
]
›› 
public
ﬁﬁ 
async
ﬁﬁ 
Task
ﬁﬁ 
<
ﬁﬁ 
ResponseModel
ﬁﬁ '
>
ﬁﬁ' (
DiscardChanges
ﬁﬁ) 7
(
ﬁﬁ7 8
string
ﬁﬁ8 >
id
ﬁﬁ? A
)
ﬁﬁA B
{
ﬂﬂ 	
if
‡‡ 
(
‡‡ 
id
‡‡ 
==
‡‡ 
null
‡‡ 
)
‡‡ 
{
·· 
var
‚‚ !
invalidParameterMSG
‚‚ '
=
‚‚( )
await
‚‚* /$
_dynamicMessageService
‚‚0 F
.
‚‚F G
Get
‚‚G J
(
‚‚J K
INVALID_PARAMETER
‚‚K \
)
‚‚\ ]
;
‚‚] ^
return
„„ 
new
„„ 
ResponseModel
„„ (
(
„„( )
)
„„) *
{
„„+ ,
	IsSuccess
„„- 6
=
„„7 8
false
„„9 >
,
„„> ?

StatusCode
„„@ J
=
„„K L
(
„„M N
int
„„N Q
)
„„Q R
APIStatusCode
„„R _
.
„„_ `
BAD_REQUEST
„„` k
,
„„k l
Message
„„m t
=
„„u v"
invalidParameterMSG„„w ä
.„„ä ã
message„„ã í
}„„ì î
;„„î ï
}
‰‰ 
try
ÂÂ 
{
ÊÊ 
var
ÁÁ 

reportData
ÁÁ 
=
ÁÁ  
await
ÁÁ! &
_FJTSqlDBContext
ÁÁ' 7
.
ÁÁ7 8
reportmaster
ÁÁ8 D
.
ÁÁD E
Where
ÁÁE J
(
ÁÁJ K
x
ÁÁK L
=>
ÁÁM O
x
ÁÁP Q
.
ÁÁQ R
fileName
ÁÁR Z
==
ÁÁ[ ]
id
ÁÁ^ `
&&
ÁÁa c
x
ÁÁd e
.
ÁÁe f
	isDeleted
ÁÁf o
==
ÁÁp r
false
ÁÁs x
)
ÁÁx y
.
ÁÁy z"
FirstOrDefaultAsyncÁÁz ç
(ÁÁç é
)ÁÁé è
;ÁÁè ê
if
ËË 
(
ËË 

reportData
ËË 
==
ËË !
null
ËË" &
)
ËË& '
{
ÈÈ 
var
ÍÍ 
notFoundMSG
ÍÍ #
=
ÍÍ$ %
await
ÍÍ& +$
_dynamicMessageService
ÍÍ, B
.
ÍÍB C
Get
ÍÍC F
(
ÍÍF G
	NOT_FOUND
ÍÍG P
)
ÍÍP Q
;
ÍÍQ R
return
ÎÎ 
new
ÎÎ 
ResponseModel
ÎÎ ,
(
ÎÎ, -
)
ÎÎ- .
{
ÎÎ/ 0
	IsSuccess
ÎÎ1 :
=
ÎÎ; <
false
ÎÎ= B
,
ÎÎB C

StatusCode
ÎÎD N
=
ÎÎO P
(
ÎÎQ R
int
ÎÎR U
)
ÎÎU V
APIStatusCode
ÎÎV c
.
ÎÎc d
PAGE_NOT_FOUND
ÎÎd r
,
ÎÎr s
Message
ÎÎt {
=
ÎÎ| }
stringÎÎ~ Ñ
.ÎÎÑ Ö
FormatÎÎÖ ã
(ÎÎã å
notFoundMSGÎÎå ó
.ÎÎó ò
messageÎÎò ü
,ÎÎü †
REPORT_DETAILSÎÎ° Ø
)ÎÎØ ∞
}ÎÎ± ≤
;ÎÎ≤ ≥
}
ÏÏ 

reportData
ÓÓ 
.
ÓÓ 
status
ÓÓ !
=
ÓÓ" #
ReportStatus
ÓÓ$ 0
.
ÓÓ0 1
	Published
ÓÓ1 :
.
ÓÓ: ;
GetDisplayValue
ÓÓ; J
(
ÓÓJ K
)
ÓÓK L
;
ÓÓL M

reportData
ÔÔ 
.
ÔÔ 
	updatedBy
ÔÔ $
=
ÔÔ% &
	GetUserId
ÔÔ' 0
(
ÔÔ0 1
)
ÔÔ1 2
;
ÔÔ2 3

reportData
 
.
 
	updatedAt
 $
=
% &
StaticMethods
' 4
.
4 5
GetUtcDateTime
5 C
(
C D
)
D E
;
E F

reportData
ÒÒ 
.
ÒÒ 
updateByRoleId
ÒÒ )
=
ÒÒ* +
null
ÒÒ, 0
;
ÒÒ0 1
System
ÙÙ 
.
ÙÙ 
IO
ÙÙ 
.
ÙÙ 
File
ÙÙ 
.
ÙÙ 
Delete
ÙÙ %
(
ÙÙ% &
_constantPath
ÙÙ& 3
.
ÙÙ3 4

ReportPath
ÙÙ4 >
+
ÙÙ? @

reportData
ÙÙA K
.
ÙÙK L
draftFileName
ÙÙL Y
+
ÙÙZ [
REPORT_EXTENSION
ÙÙ\ l
)
ÙÙl m
;
ÙÙm n

reportData
ıı 
.
ıı 
draftFileName
ıı (
=
ıı) *
null
ıı+ /
;
ıı/ 0
await
ˆˆ 
_FJTSqlDBContext
ˆˆ &
.
ˆˆ& '
SaveChangesAsync
ˆˆ' 7
(
ˆˆ7 8
)
ˆˆ8 9
;
ˆˆ9 :
var
¯¯ 
responseMSG
¯¯ 
=
¯¯  !
await
¯¯" '$
_dynamicMessageService
¯¯( >
.
¯¯> ?
Get
¯¯? B
(
¯¯B C*
SUCCESSFULLY_DISCARD_CHANGES
¯¯C _
)
¯¯_ `
;
¯¯` a
return
˘˘ 
new
˘˘ 
ResponseModel
˘˘ (
(
˘˘( )
)
˘˘) *
{
˘˘+ ,
	IsSuccess
˘˘- 6
=
˘˘7 8
true
˘˘9 =
,
˘˘= >

StatusCode
˘˘? I
=
˘˘J K
(
˘˘L M
int
˘˘M P
)
˘˘P Q
APIStatusCode
˘˘Q ^
.
˘˘^ _
SUCCESS
˘˘_ f
,
˘˘f g
Message
˘˘h o
=
˘˘p q
responseMSG
˘˘r }
.
˘˘} ~
message˘˘~ Ö
}˘˘Ü á
;˘˘á à
}
˙˙ 
catch
˚˚ 
(
˚˚ 
	Exception
˚˚ 
e
˚˚ 
)
˚˚ 
{
¸¸ 
_logger
˝˝ 
.
˝˝ 
LogError
˝˝  
(
˝˝  !
e
˝˝! "
.
˝˝" #
ToString
˝˝# +
(
˝˝+ ,
)
˝˝, -
)
˝˝- .
;
˝˝. /
var
˛˛ 
somethingWrongMSG
˛˛ %
=
˛˛& '
await
˛˛( -$
_dynamicMessageService
˛˛. D
.
˛˛D E
Get
˛˛E H
(
˛˛H I
SOMTHING_WRONG
˛˛I W
)
˛˛W X
;
˛˛X Y
return
ˇˇ 
new
ˇˇ 
ResponseModel
ˇˇ (
(
ˇˇ( )
)
ˇˇ) *
{
ˇˇ+ ,
	IsSuccess
ˇˇ- 6
=
ˇˇ7 8
false
ˇˇ9 >
,
ˇˇ> ?

StatusCode
ˇˇ@ J
=
ˇˇK L
(
ˇˇM N
int
ˇˇN Q
)
ˇˇQ R
APIStatusCode
ˇˇR _
.
ˇˇ_ `#
INTERNAL_SERVER_ERROR
ˇˇ` u
,
ˇˇu v
Message
ˇˇw ~
=ˇˇ Ä!
somethingWrongMSGˇˇÅ í
.ˇˇí ì
messageˇˇì ö
}ˇˇõ ú
;ˇˇú ù
}
ÄÄ 
}
ÅÅ 	
[
àà 	
HttpPost
àà	 
]
àà 
public
ââ 
async
ââ 
Task
ââ 
<
ââ 
ResponseModel
ââ '
>
ââ' (
StopActivity
ââ) 5
(
ââ5 6
string
ââ6 <
id
ââ= ?
)
ââ? @
{
ää 	
if
ãã 
(
ãã 
id
ãã 
==
ãã 
null
ãã 
)
ãã 
{
åå 
var
çç !
invalidParameterMSG
çç '
=
çç( )
await
çç* /$
_dynamicMessageService
çç0 F
.
ççF G
Get
ççG J
(
ççJ K
INVALID_PARAMETER
ççK \
)
çç\ ]
;
çç] ^
return
éé 
new
éé 
ResponseModel
éé (
(
éé( )
)
éé) *
{
éé+ ,
	IsSuccess
éé- 6
=
éé7 8
false
éé9 >
,
éé> ?

StatusCode
éé@ J
=
ééK L
(
ééM N
int
ééN Q
)
ééQ R
APIStatusCode
ééR _
.
éé_ `
BAD_REQUEST
éé` k
,
éék l
Message
éém t
=
ééu v"
invalidParameterMSGééw ä
.ééä ã
messageééã í
}ééì î
;ééî ï
}
èè 
try
êê 
{
ëë 
var
íí 

reportData
íí 
=
íí  
await
íí! &
_FJTSqlDBContext
íí' 7
.
íí7 8
reportmaster
íí8 D
.
ííD E
Where
ííE J
(
ííJ K
x
ííK L
=>
ííM O
x
ííP Q
.
ííQ R
fileName
ííR Z
==
íí[ ]
id
íí^ `
&&
íía c
x
ííd e
.
ííe f
	isDeleted
ííf o
==
ííp r
false
íís x
)
ííx y
.
ííy z"
FirstOrDefaultAsyncííz ç
(ííç é
)ííé è
;ííè ê
if
ìì 
(
ìì 

reportData
ìì 
==
ìì !
null
ìì" &
)
ìì& '
{
îî 
var
ïï 
notFoundMSG
ïï #
=
ïï$ %
await
ïï& +$
_dynamicMessageService
ïï, B
.
ïïB C
Get
ïïC F
(
ïïF G
	NOT_FOUND
ïïG P
)
ïïP Q
;
ïïQ R
return
ññ 
new
ññ 
ResponseModel
ññ ,
(
ññ, -
)
ññ- .
{
ññ/ 0
	IsSuccess
ññ1 :
=
ññ; <
false
ññ= B
,
ññB C

StatusCode
ññD N
=
ññO P
(
ññQ R
int
ññR U
)
ññU V
APIStatusCode
ññV c
.
ññc d
PAGE_NOT_FOUND
ññd r
,
ññr s
Message
ññt {
=
ññ| }
stringññ~ Ñ
.ññÑ Ö
FormatññÖ ã
(ññã å
notFoundMSGññå ó
.ññó ò
messageññò ü
,ññü †
REPORT_DETAILSññ° Ø
)ññØ ∞
}ññ± ≤
;ññ≤ ≥
}
óó 

reportData
òò 
.
òò 
	editingBy
òò $
=
òò% &
null
òò' +
;
òò+ ,

reportData
ôô 
.
ôô  
startDesigningDate
ôô -
=
ôô. /
null
ôô0 4
;
ôô4 5
var
úú 
reportChangeLog
úú #
=
úú$ %
await
úú& +
_FJTSqlDBContext
úú, <
.
úú< = 
report_change_logs
úú= O
.
úúO P!
FirstOrDefaultAsync
úúP c
(
úúc d
x
úúd e
=>
úúf h
x
úúi j
.
úúj k
reportId
úúk s
==
úút v

reportDataúúw Å
.úúÅ Ç
idúúÇ Ñ
&&úúÖ á
xúúà â
.úúâ ä
endActivityDateúúä ô
==úúö ú
nullúúù °
&&úú¢ §
xúú• ¶
.úú¶ ß
	isDeletedúúß ∞
==úú± ≥
falseúú¥ π
)úúπ ∫
;úú∫ ª
if
ùù 
(
ùù 
reportChangeLog
ùù #
==
ùù$ &
null
ùù' +
)
ùù+ ,
{
ûû 
var
üü 
notFoundMSG
üü #
=
üü$ %
await
üü& +$
_dynamicMessageService
üü, B
.
üüB C
Get
üüC F
(
üüF G
	NOT_FOUND
üüG P
)
üüP Q
;
üüQ R
return
†† 
new
†† 
ResponseModel
†† ,
(
††, -
)
††- .
{
††/ 0
	IsSuccess
††1 :
=
††; <
false
††= B
,
††B C

StatusCode
††D N
=
††O P
(
††Q R
int
††R U
)
††U V
APIStatusCode
††V c
.
††c d
PAGE_NOT_FOUND
††d r
,
††r s
Message
††t {
=
††| }
string††~ Ñ
.††Ñ Ö
Format††Ö ã
(††ã å
notFoundMSG††å ó
.††ó ò
message††ò ü
,††ü †&
START_ACTIVITY_DETAILS††° ∑
)††∑ ∏
}††π ∫
;††∫ ª
}
°° 
reportChangeLog
¢¢ 
.
¢¢  
endActivityDate
¢¢  /
=
¢¢0 1
StaticMethods
¢¢2 ?
.
¢¢? @
GetUtcDateTime
¢¢@ N
(
¢¢N O
)
¢¢O P
;
¢¢P Q
reportChangeLog
££ 
.
££  
	updatedBy
££  )
=
££* +
	GetUserId
££, 5
(
££5 6
)
££6 7
;
££7 8
reportChangeLog
§§ 
.
§§  
	updatedAt
§§  )
=
§§* +
StaticMethods
§§, 9
.
§§9 :
GetUtcDateTime
§§: H
(
§§H I
)
§§I J
;
§§J K
reportChangeLog
•• 
.
••  
updateByRoleId
••  .
=
••/ 0
null
••1 5
;
••5 6
await
¶¶ 
_FJTSqlDBContext
¶¶ &
.
¶¶& '
SaveChangesAsync
¶¶' 7
(
¶¶7 8
)
¶¶8 9
;
¶¶9 :
var
®® 
responseMSG
®® 
=
®®  !
await
®®" '$
_dynamicMessageService
®®( >
.
®®> ?
Get
®®? B
(
®®B C#
STOP_ACTIVITY_SUCCESS
®®C X
)
®®X Y
;
®®Y Z
return
©© 
new
©© 
ResponseModel
©© (
(
©©( )
)
©©) *
{
©©+ ,
	IsSuccess
©©- 6
=
©©7 8
true
©©9 =
,
©©= >

StatusCode
©©? I
=
©©J K
(
©©L M
int
©©M P
)
©©P Q
APIStatusCode
©©Q ^
.
©©^ _
SUCCESS
©©_ f
,
©©f g
Message
©©h o
=
©©p q
responseMSG
©©r }
.
©©} ~
message©©~ Ö
}©©Ü á
;©©á à
}
™™ 
catch
´´ 
(
´´ 
	Exception
´´ 
e
´´ 
)
´´ 
{
¨¨ 
_logger
≠≠ 
.
≠≠ 
LogError
≠≠  
(
≠≠  !
e
≠≠! "
.
≠≠" #
ToString
≠≠# +
(
≠≠+ ,
)
≠≠, -
)
≠≠- .
;
≠≠. /
var
ÆÆ 
somethingWrongMSG
ÆÆ %
=
ÆÆ& '
await
ÆÆ( -$
_dynamicMessageService
ÆÆ. D
.
ÆÆD E
Get
ÆÆE H
(
ÆÆH I
SOMTHING_WRONG
ÆÆI W
)
ÆÆW X
;
ÆÆX Y
return
ØØ 
new
ØØ 
ResponseModel
ØØ (
(
ØØ( )
)
ØØ) *
{
ØØ+ ,
	IsSuccess
ØØ- 6
=
ØØ7 8
false
ØØ9 >
,
ØØ> ?

StatusCode
ØØ@ J
=
ØØK L
(
ØØM N
int
ØØN Q
)
ØØQ R
APIStatusCode
ØØR _
.
ØØ_ `#
INTERNAL_SERVER_ERROR
ØØ` u
,
ØØu v
Message
ØØw ~
=ØØ Ä!
somethingWrongMSGØØÅ í
.ØØí ì
messageØØì ö
}ØØõ ú
;ØØú ù
}
∞∞ 
}
±± 	
[
∏∏ 	
HttpPost
∏∏	 
]
∏∏ 
public
ππ 
async
ππ 
Task
ππ 
<
ππ 
ResponseModel
ππ '
>
ππ' ("
SaveReportBySaveMode
ππ) =
(
ππ= >
[
ππ> ?
FromBody
ππ? G
]
ππG H
SaveReportModel
ππI X
	saveModel
ππY b
)
ππb c
{
∫∫ 	
if
ªª 
(
ªª 
	saveModel
ªª 
==
ªª 
null
ªª !
)
ªª! "
{
ºº 
var
ΩΩ !
invalidParameterMSG
ΩΩ '
=
ΩΩ( )
await
ΩΩ* /$
_dynamicMessageService
ΩΩ0 F
.
ΩΩF G
Get
ΩΩG J
(
ΩΩJ K
INVALID_PARAMETER
ΩΩK \
)
ΩΩ\ ]
;
ΩΩ] ^
return
ææ 
new
ææ 
ResponseModel
ææ (
(
ææ( )
)
ææ) *
{
ææ+ ,
	IsSuccess
ææ- 6
=
ææ7 8
false
ææ9 >
,
ææ> ?

StatusCode
ææ@ J
=
ææK L
(
ææM N
int
ææN Q
)
ææQ R
APIStatusCode
ææR _
.
ææ_ `
BAD_REQUEST
ææ` k
,
ææk l
Message
ææm t
=
ææu v"
invalidParameterMSGææw ä
.ææä ã
messageææã í
}ææì î
;ææî ï
}
øø 
HttpContext
¬¬ 
.
¬¬ 
Session
¬¬ 
.
¬¬  
TryGetValue
¬¬  +
(
¬¬+ ,
$str
¬¬, @
,
¬¬@ A
out
¬¬B E
byte
¬¬F J
[
¬¬J K
]
¬¬K L
reportByteData
¬¬M [
)
¬¬[ \
;
¬¬\ ]
if
√√ 
(
√√ 
reportByteData
√√ 
==
√√ !
null
√√" &
)
√√& '
{
ƒƒ 
var
≈≈ 
somethingWrongMSG
≈≈ %
=
≈≈& '
await
≈≈( -$
_dynamicMessageService
≈≈. D
.
≈≈D E
Get
≈≈E H
(
≈≈H I
SOMTHING_WRONG
≈≈I W
)
≈≈W X
;
≈≈X Y
return
∆∆ 
new
∆∆ 
ResponseModel
∆∆ (
(
∆∆( )
)
∆∆) *
{
∆∆+ ,
	IsSuccess
∆∆- 6
=
∆∆7 8
false
∆∆9 >
,
∆∆> ?

StatusCode
∆∆@ J
=
∆∆K L
(
∆∆M N
int
∆∆N Q
)
∆∆Q R
APIStatusCode
∆∆R _
.
∆∆_ `#
INTERNAL_SERVER_ERROR
∆∆` u
,
∆∆u v
Message
∆∆w ~
=∆∆ Ä!
somethingWrongMSG∆∆Å í
.∆∆í ì
message∆∆ì ö
}∆∆õ ú
;∆∆ú ù
}
«« 
	saveModel
»» 
.
»» 
ReportByteData
»» $
=
»»% &
reportByteData
»»' 5
;
»»5 6
try
   
{
ÀÀ 
var
ÃÃ 
reportMaster
ÃÃ  
=
ÃÃ! "
await
ÃÃ# (
_FJTSqlDBContext
ÃÃ) 9
.
ÃÃ9 :
reportmaster
ÃÃ: F
.
ÃÃF G!
FirstOrDefaultAsync
ÃÃG Z
(
ÃÃZ [
x
ÃÃ[ \
=>
ÃÃ] _
x
ÃÃ` a
.
ÃÃa b
fileName
ÃÃb j
==
ÃÃk m
	saveModel
ÃÃn w
.
ÃÃw x

ReportGUIDÃÃx Ç
&&ÃÃÉ Ö
xÃÃÜ á
.ÃÃá à
	isDeletedÃÃà ë
==ÃÃí î
falseÃÃï ö
)ÃÃö õ
;ÃÃõ ú
var
ÕÕ 
reportVersion
ÕÕ !
=
ÕÕ" #
$num
ÕÕ$ %
;
ÕÕ% &
if
ŒŒ 
(
ŒŒ 
reportMaster
ŒŒ  
==
ŒŒ! #
null
ŒŒ$ (
)
ŒŒ( )
{
œœ 
var
–– 
notFoundMSG
–– #
=
––$ %
await
––& +$
_dynamicMessageService
––, B
.
––B C
Get
––C F
(
––F G
	NOT_FOUND
––G P
)
––P Q
;
––Q R
return
—— 
new
—— 
ResponseModel
—— ,
(
——, -
)
——- .
{
——/ 0
	IsSuccess
——1 :
=
——; <
false
——= B
,
——B C

StatusCode
——D N
=
——O P
(
——Q R
int
——R U
)
——U V
APIStatusCode
——V c
.
——c d
PAGE_NOT_FOUND
——d r
,
——r s
Message
——t {
=
——| }
string——~ Ñ
.——Ñ Ö
Format——Ö ã
(——ã å
notFoundMSG——å ó
.——ó ò
message——ò ü
,——ü †
REPORT_DETAILS——° Ø
)——Ø ∞
}——± ≤
;——≤ ≥
}
““ 
reportMaster
”” 
.
”” 
	updatedBy
”” &
=
””' (
	GetUserId
””) 2
(
””2 3
)
””3 4
;
””4 5
reportMaster
‘‘ 
.
‘‘ 
	updatedAt
‘‘ &
=
‘‘' (
StaticMethods
‘‘) 6
.
‘‘6 7
GetUtcDateTime
‘‘7 E
(
‘‘E F
)
‘‘F G
;
‘‘G H
reportMaster
’’ 
.
’’ 
updateByRoleId
’’ +
=
’’, -
null
’’. 2
;
’’2 3
var
÷÷ 
reportFolderPath
÷÷ $
=
÷÷% &
_constantPath
÷÷' 4
.
÷÷4 5

ReportPath
÷÷5 ?
;
÷÷? @
if
ŸŸ 
(
ŸŸ 
	saveModel
ŸŸ 
.
ŸŸ 
SaveReportMode
ŸŸ ,
==
ŸŸ- /
PUBLISH_MODE
ŸŸ0 <
)
ŸŸ< =
{
⁄⁄ 
reportMaster
€€  
.
€€  !
status
€€! '
=
€€( )
ReportStatus
€€* 6
.
€€6 7
	Published
€€7 @
.
€€@ A
GetDisplayValue
€€A P
(
€€P Q
)
€€Q R
;
€€R S
if
›› 
(
›› 
!
›› 
(
›› 
	saveModel
›› #
.
››# $
PublishVersion
››$ 2
==
››3 5
null
››6 :
||
››; =
	saveModel
››> G
.
››G H
PublishVersion
››H V
==
››W Y
$str
››Z \
)
››\ ]
)
››] ^
{
ﬁﬁ 
reportVersion
ﬂﬂ %
=
ﬂﬂ& '
Int32
ﬂﬂ( -
.
ﬂﬂ- .
Parse
ﬂﬂ. 3
(
ﬂﬂ3 4
	saveModel
ﬂﬂ4 =
.
ﬂﬂ= >
PublishVersion
ﬂﬂ> L
)
ﬂﬂL M
+
ﬂﬂN O
$num
ﬂﬂP Q
;
ﬂﬂQ R
}
‡‡ 
reportMaster
··  
.
··  !
reportVersion
··! .
=
··/ 0
reportVersion
··1 >
.
··> ?
ToString
··? G
(
··G H
)
··H I
;
··I J
System
‰‰ 
.
‰‰ 
IO
‰‰ 
.
‰‰ 
File
‰‰ "
.
‰‰" #
WriteAllBytes
‰‰# 0
(
‰‰0 1
reportFolderPath
‰‰1 A
+
‰‰B C
	saveModel
‰‰D M
.
‰‰M N

ReportGUID
‰‰N X
+
‰‰Y Z
REPORT_EXTENSION
‰‰[ k
,
‰‰k l
	saveModel
‰‰m v
.
‰‰v w
ReportByteData‰‰w Ö
)‰‰Ö Ü
;‰‰Ü á
System
ÁÁ 
.
ÁÁ 
IO
ÁÁ 
.
ÁÁ 
File
ÁÁ "
.
ÁÁ" #
Delete
ÁÁ# )
(
ÁÁ) *
reportFolderPath
ÁÁ* :
+
ÁÁ; <
reportMaster
ÁÁ= I
.
ÁÁI J
draftFileName
ÁÁJ W
+
ÁÁX Y
REPORT_EXTENSION
ÁÁZ j
)
ÁÁj k
;
ÁÁk l
reportMaster
ËË  
.
ËË  !
draftFileName
ËË! .
=
ËË/ 0
null
ËË1 5
;
ËË5 6
await
ÈÈ 
_FJTSqlDBContext
ÈÈ *
.
ÈÈ* +
SaveChangesAsync
ÈÈ+ ;
(
ÈÈ; <
)
ÈÈ< =
;
ÈÈ= >
var
ÎÎ 
publishedMSG
ÎÎ $
=
ÎÎ% &
await
ÎÎ' ,$
_dynamicMessageService
ÎÎ- C
.
ÎÎC D
Get
ÎÎD G
(
ÎÎG H$
SUCCESSFULLY_PUBLISHED
ÎÎH ^
)
ÎÎ^ _
;
ÎÎ_ `
return
ÏÏ 
new
ÏÏ 
ResponseModel
ÏÏ ,
(
ÏÏ, -
)
ÏÏ- .
{
ÏÏ/ 0
	IsSuccess
ÏÏ1 :
=
ÏÏ; <
true
ÏÏ= A
,
ÏÏA B

StatusCode
ÏÏC M
=
ÏÏN O
(
ÏÏP Q
int
ÏÏQ T
)
ÏÏT U
APIStatusCode
ÏÏU b
.
ÏÏb c
SUCCESS
ÏÏc j
,
ÏÏj k
Message
ÏÏl s
=
ÏÏt u
publishedMSGÏÏv Ç
.ÏÏÇ É
messageÏÏÉ ä
}ÏÏã å
;ÏÏå ç
}
ÌÌ 
else
ÓÓ 
if
ÓÓ 
(
ÓÓ 
	saveModel
ÓÓ "
.
ÓÓ" #
SaveReportMode
ÓÓ# 1
==
ÓÓ2 4

DRAFT_MODE
ÓÓ5 ?
)
ÓÓ? @
{
ÔÔ 
reportMaster
  
.
  !
status
! '
=
( )
ReportStatus
* 6
.
6 7
Draft
7 <
.
< =
GetDisplayValue
= L
(
L M
)
M N
;
N O
if
ÒÒ 
(
ÒÒ 
reportMaster
ÒÒ $
.
ÒÒ$ %
draftFileName
ÒÒ% 2
==
ÒÒ3 5
null
ÒÒ6 :
)
ÒÒ: ;
{
ÚÚ 
reportMaster
ÛÛ $
.
ÛÛ$ %
draftFileName
ÛÛ% 2
=
ÛÛ3 4
System
ÛÛ5 ;
.
ÛÛ; <
Guid
ÛÛ< @
.
ÛÛ@ A
NewGuid
ÛÛA H
(
ÛÛH I
)
ÛÛI J
.
ÛÛJ K
ToString
ÛÛK S
(
ÛÛS T
)
ÛÛT U
;
ÛÛU V
}
ÙÙ 
System
ˆˆ 
.
ˆˆ 
IO
ˆˆ 
.
ˆˆ 
File
ˆˆ "
.
ˆˆ" #
WriteAllBytes
ˆˆ# 0
(
ˆˆ0 1
reportFolderPath
ˆˆ1 A
+
ˆˆB C
reportMaster
ˆˆD P
.
ˆˆP Q
draftFileName
ˆˆQ ^
+
ˆˆ_ `
REPORT_EXTENSION
ˆˆa q
,
ˆˆq r
	saveModel
ˆˆs |
.
ˆˆ| }
ReportByteDataˆˆ} ã
)ˆˆã å
;ˆˆå ç
await
˜˜ 
_FJTSqlDBContext
˜˜ *
.
˜˜* +
SaveChangesAsync
˜˜+ ;
(
˜˜; <
)
˜˜< =
;
˜˜= >
var
˘˘ 
responseMSG
˘˘ #
=
˘˘$ %
await
˘˘& +$
_dynamicMessageService
˘˘, B
.
˘˘B C
Get
˘˘C F
(
˘˘F G(
SUCCESSFULLY_SAVE_AS_DRAFT
˘˘G a
)
˘˘a b
;
˘˘b c
return
˙˙ 
new
˙˙ 
ResponseModel
˙˙ ,
(
˙˙, -
)
˙˙- .
{
˙˙/ 0
	IsSuccess
˙˙1 :
=
˙˙; <
true
˙˙= A
,
˙˙A B

StatusCode
˙˙C M
=
˙˙N O
(
˙˙P Q
int
˙˙Q T
)
˙˙T U
APIStatusCode
˙˙U b
.
˙˙b c
SUCCESS
˙˙c j
,
˙˙j k
Message
˙˙l s
=
˙˙t u
responseMSG˙˙v Å
.˙˙Å Ç
message˙˙Ç â
}˙˙ä ã
;˙˙ã å
}
˚˚ 
else
¸¸ 
{
˝˝ 
var
˛˛ !
invalidParameterMSG
˛˛ +
=
˛˛, -
await
˛˛. 3$
_dynamicMessageService
˛˛4 J
.
˛˛J K
Get
˛˛K N
(
˛˛N O
INVALID_PARAMETER
˛˛O `
)
˛˛` a
;
˛˛a b
return
ˇˇ 
new
ˇˇ 
ResponseModel
ˇˇ ,
(
ˇˇ, -
)
ˇˇ- .
{
ˇˇ/ 0
	IsSuccess
ˇˇ1 :
=
ˇˇ; <
false
ˇˇ= B
,
ˇˇB C

StatusCode
ˇˇD N
=
ˇˇO P
(
ˇˇQ R
int
ˇˇR U
)
ˇˇU V
APIStatusCode
ˇˇV c
.
ˇˇc d
BAD_REQUEST
ˇˇd o
,
ˇˇo p
Message
ˇˇq x
=
ˇˇy z"
invalidParameterMSGˇˇ{ é
.ˇˇé è
messageˇˇè ñ
}ˇˇó ò
;ˇˇò ô
}
ÅÅ 
}
ÇÇ 
catch
ÉÉ 
(
ÉÉ 
	Exception
ÉÉ 
e
ÉÉ 
)
ÉÉ 
{
ÑÑ 
_logger
ÖÖ 
.
ÖÖ 
LogError
ÖÖ  
(
ÖÖ  !
e
ÖÖ! "
.
ÖÖ" #
ToString
ÖÖ# +
(
ÖÖ+ ,
)
ÖÖ, -
)
ÖÖ- .
;
ÖÖ. /
var
ÜÜ 
somethingWrongMSG
ÜÜ %
=
ÜÜ& '
await
ÜÜ( -$
_dynamicMessageService
ÜÜ. D
.
ÜÜD E
Get
ÜÜE H
(
ÜÜH I
SOMTHING_WRONG
ÜÜI W
)
ÜÜW X
;
ÜÜX Y
return
áá 
new
áá 
ResponseModel
áá (
(
áá( )
)
áá) *
{
áá+ ,
	IsSuccess
áá- 6
=
áá7 8
false
áá9 >
,
áá> ?

StatusCode
áá@ J
=
ááK L
(
ááM N
int
ááN Q
)
ááQ R
APIStatusCode
ááR _
.
áá_ `#
INTERNAL_SERVER_ERROR
áá` u
,
ááu v
Message
ááw ~
=áá Ä!
somethingWrongMSGááÅ í
.ááí ì
messageááì ö
}ááõ ú
;ááú ù
}
ââ 
}
ää 	
public
ëë 
async
ëë 
Task
ëë 
<
ëë 
IActionResult
ëë '
>
ëë' (
ExitDesigner
ëë) 5
(
ëë5 6
string
ëë6 <
id
ëë= ?
)
ëë? @
{
íí 	
if
ìì 
(
ìì 
id
ìì 
==
ìì 
null
ìì 
)
ìì 
{
îî 
var
ïï !
invalidParameterMSG
ïï '
=
ïï( )
await
ïï* /$
_dynamicMessageService
ïï0 F
.
ïïF G
Get
ïïG J
(
ïïJ K
INVALID_PARAMETER
ïïK \
)
ïï\ ]
;
ïï] ^
return
ññ 
View
ññ 
(
ññ 
$str
ññ #
,
ññ# $
new
ññ% (
ErrorViewModel
ññ) 7
{
ññ8 9

StatusCode
ññ: D
=
ññE F
(
ññG H
int
ññH K
)
ññK L
APIStatusCode
ññL Y
.
ññY Z
BAD_REQUEST
ññZ e
,
ññe f
Message
ññg n
=
ñño p"
invalidParameterMSGññq Ñ
.ññÑ Ö
messageññÖ å
}ññç é
)ññé è
;ññè ê
}
óó 
var
ôô 
responseModel
ôô 
=
ôô 
await
ôô  %
StopActivity
ôô& 2
(
ôô2 3
id
ôô3 5
)
ôô5 6
;
ôô6 7
if
öö 
(
öö 
responseModel
öö 
.
öö 
	IsSuccess
öö '
==
öö( *
false
öö+ 0
)
öö0 1
{
õõ 
return
úú 
View
úú 
(
úú 
$str
úú #
,
úú# $
new
úú% (
ErrorViewModel
úú) 7
{
úú8 9

StatusCode
úú: D
=
úúE F
responseModel
úúG T
.
úúT U

StatusCode
úúU _
,
úú_ `
Message
úúa h
=
úúi j
responseModel
úúk x
.
úúx y
Messageúúy Ä
}úúÅ Ç
)úúÇ É
;úúÉ Ñ
}
ùù 
else
ûû 
{
üü 
return
†† 
Redirect
†† 
(
††  
_constantPath
††  -
.
††- .
	UiPageUrl
††. 7
)
††7 8
;
††8 9
}
°° 
}
¢¢ 	
[
©© 	
Route
©©	 
(
©© 
$str
©© &
)
©©& '
]
©©' (
[
™™ 	
	Authorize
™™	 
(
™™ #
AuthenticationSchemes
™™ (
=
™™) *
JwtBearerDefaults
™™+ <
.
™™< ="
AuthenticationScheme
™™= Q
)
™™Q R
]
™™R S
[
´´ 	
HttpPost
´´	 
]
´´ 
public
¨¨ 
async
¨¨ 
Task
¨¨ 
<
¨¨ 
IActionResult
¨¨ '
>
¨¨' (
CreateReport
¨¨) 5
(
¨¨5 6
[
¨¨6 7
FromBody
¨¨7 ?
]
¨¨? @
ReportmasterVM
¨¨A O
reportmasterVM
¨¨P ^
)
¨¨^ _
{
≠≠ 	
if
ÆÆ 
(
ÆÆ 
reportmasterVM
ÆÆ 
==
ÆÆ !
null
ÆÆ" &
)
ÆÆ& '
{
ØØ 
var
∞∞ !
invalidParameterMSG
∞∞ '
=
∞∞( )
await
∞∞* /$
_dynamicMessageService
∞∞0 F
.
∞∞F G
Get
∞∞G J
(
∞∞J K
INVALID_PARAMETER
∞∞K \
)
∞∞\ ]
;
∞∞] ^
return
±± '
_iHttpsResponseRepository
±± 0
.
±±0 1
ReturnResult
±±1 =
(
±±= >
APIStatusCode
±±> K
.
±±K L
ERROR
±±L Q
,
±±Q R
APIState
±±S [
.
±±[ \
FAILED
±±\ b
,
±±b c
null
±±d h
,
±±h i
new
±±j m
UserMessage
±±n y
(
±±y z
)
±±z {
{
±±| }
messageContent±±~ å
=±±ç é
new±±è í
MessageContent±±ì °
{±±¢ £
messageType±±§ Ø
=±±∞ ±#
invalidParameterMSG±±≤ ≈
.±±≈ ∆
messageType±±∆ —
,±±— “
messageCode±±” ﬁ
=±±ﬂ ‡#
invalidParameterMSG±±· Ù
.±±Ù ı
messageCode±±ı Ä
,±±Ä Å
message±±Ç â
=±±ä ã#
invalidParameterMSG±±å ü
.±±ü †
message±±† ß
}±±® ©
}±±™ ´
)±±´ ¨
;±±¨ ≠
}
≤≤ 
try
≥≥ 
{
¥¥ 
var
µµ 
isUpdate
µµ 
=
µµ 
false
µµ $
;
µµ$ %
var
∂∂ #
newReportFromTemplate
∂∂ )
=
∂∂* +
false
∂∂, 1
;
∂∂1 2
var
∑∑  
templateReportPath
∑∑ &
=
∑∑' (
string
∑∑) /
.
∑∑/ 0
Empty
∑∑0 5
;
∑∑5 6
var
∏∏ 

reportName
∏∏ 
=
∏∏  
reportmasterVM
∏∏! /
.
∏∏/ 0

reportName
∏∏0 :
;
∏∏: ;
var
ππ 

reportPath
ππ 
=
ππ  
_constantPath
ππ! .
.
ππ. /

ReportPath
ππ/ 9
;
ππ9 :
int
ªª 
?
ªª 
entityId
ªª 
=
ªª 
reportmasterVM
ªª  .
.
ªª. /
entityId
ªª/ 7
;
ªª7 8
int
ºº 
?
ºº 
reportCategoryId
ºº %
=
ºº& '
reportmasterVM
ºº( 6
.
ºº6 7
gencCategoryID
ºº7 E
;
ººE F
if
ææ 
(
ææ 
reportmasterVM
ææ "
.
ææ" #
id
ææ# %
!=
ææ& (
$num
ææ) *
)
ææ* +
{
øø 
isUpdate
¿¿ 
=
¿¿ 
true
¿¿ #
;
¿¿# $
}
¡¡ 
if
√√ 
(
√√ 
reportmasterVM
√√ "
.
√√" #
isDefaultReport
√√# 2
)
√√2 3
{
ƒƒ 
var
≈≈ 
defaultReport
≈≈ %
=
≈≈& '
await
≈≈( -
_FJTSqlDBContext
≈≈. >
.
≈≈> ?
reportmaster
≈≈? K
.
≈≈K L!
FirstOrDefaultAsync
≈≈L _
(
≈≈_ `
x
≈≈` a
=>
≈≈b d
x
≈≈e f
.
≈≈f g
entityId
≈≈g o
==
≈≈p r
entityId
≈≈s {
&&
≈≈| ~
x≈≈ Ä
.≈≈Ä Å
isDefaultReport≈≈Å ê
==≈≈ë ì
true≈≈î ò
&&≈≈ô õ
x≈≈ú ù
.≈≈ù û
	isDeleted≈≈û ß
==≈≈® ™
false≈≈´ ∞
)≈≈∞ ±
;≈≈± ≤
if
∆∆ 
(
∆∆ 
defaultReport
∆∆ %
!=
∆∆& (
null
∆∆) -
)
∆∆- .
{
«« 
defaultReport
»» %
.
»»% &
isDefaultReport
»»& 5
=
»»6 7
false
»»8 =
;
»»= >
}
…… 
}
   
ReportIdModel
ÕÕ 
reportIdModel
ÕÕ +
=
ÕÕ, -
new
ÕÕ. 1
ReportIdModel
ÕÕ2 ?
(
ÕÕ? @
)
ÕÕ@ A
;
ÕÕA B
if
œœ 
(
œœ 
isUpdate
œœ 
)
œœ 
{
–– 
var
““ 
reportNameUnique
““ (
=
““) *
await
““+ 0
_FJTSqlDBContext
““1 A
.
““A B
reportmaster
““B N
.
““N O
AnyAsync
““O W
(
““W X
x
““X Y
=>
““Z \
x
““] ^
.
““^ _
id
““_ a
!=
““b d
reportmasterVM
““e s
.
““s t
id
““t v
&&
““w y
x
““z {
.
““{ |

reportName““| Ü
==““á â

reportName““ä î
&&““ï ó
x““ò ô
.““ô ö
	isDeleted““ö £
==““§ ¶
false““ß ¨
)““¨ ≠
;““≠ Æ
if
”” 
(
”” 
reportNameUnique
”” (
==
””) +
true
””, 0
)
””0 1
{
‘‘ 
var
’’ 
uniqueNameMSG
’’ )
=
’’* +
await
’’, 1$
_dynamicMessageService
’’2 H
.
’’H I
Get
’’I L
(
’’L M 
MUST_UNIQUE_GLOBAL
’’M _
)
’’_ `
;
’’` a
return
÷÷ '
_iHttpsResponseRepository
÷÷ 8
.
÷÷8 9
ReturnResult
÷÷9 E
(
÷÷E F
APIStatusCode
÷÷F S
.
÷÷S T
ERROR
÷÷T Y
,
÷÷Y Z
APIState
÷÷[ c
.
÷÷c d
FAILED
÷÷d j
,
÷÷j k
null
÷÷l p
,
÷÷p q
new
÷÷r u
UserMessage÷÷v Å
(÷÷Å Ç
)÷÷Ç É
{÷÷Ñ Ö
messageContent÷÷Ü î
=÷÷ï ñ
new÷÷ó ö
MessageContent÷÷õ ©
{÷÷™ ´
messageType÷÷¨ ∑
=÷÷∏ π
uniqueNameMSG÷÷∫ «
.÷÷« »
messageType÷÷» ”
,÷÷” ‘
messageCode÷÷’ ‡
=÷÷· ‚
uniqueNameMSG÷÷„ 
.÷÷ Ò
messageCode÷÷Ò ¸
,÷÷¸ ˝
message÷÷˛ Ö
=÷÷Ü á
string÷÷à é
.÷÷é è
Format÷÷è ï
(÷÷ï ñ
uniqueNameMSG÷÷ñ £
.÷÷£ §
message÷÷§ ´
,÷÷´ ¨
REPORT_NAME÷÷≠ ∏
)÷÷∏ π
}÷÷∫ ª
}÷÷º Ω
)÷÷Ω æ
;÷÷æ ø
}
◊◊ 
bool
⁄⁄ 
flag
⁄⁄ 
=
⁄⁄ 
false
⁄⁄  %
;
⁄⁄% &
var
€€ 
reportmasterData
€€ (
=
€€) *
await
€€+ 0
_FJTSqlDBContext
€€1 A
.
€€A B
reportmaster
€€B N
.
€€N O!
FirstOrDefaultAsync
€€O b
(
€€b c
x
€€c d
=>
€€e g
x
€€h i
.
€€i j
id
€€j l
==
€€m o
reportmasterVM
€€p ~
.
€€~ 
id€€ Å
&&€€Ç Ñ
x€€Ö Ü
.€€Ü á
	isDeleted€€á ê
==€€ë ì
false€€î ô
)€€ô ö
;€€ö õ
if
‹‹ 
(
‹‹ 
reportmasterData
‹‹ (
.
‹‹( )
isDefaultReport
‹‹) 8
==
‹‹9 ;
true
‹‹< @
&&
‹‹A C
!
‹‹D E
reportmasterVM
‹‹E S
.
‹‹S T
isDefaultReport
‹‹T c
)
‹‹c d
{
›› 
var
ﬁﬁ #
systemGeneratedReport
ﬁﬁ 1
=
ﬁﬁ2 3
await
ﬁﬁ4 9
_FJTSqlDBContext
ﬁﬁ: J
.
ﬁﬁJ K
reportmaster
ﬁﬁK W
.
ﬁﬁW X!
FirstOrDefaultAsync
ﬁﬁX k
(
ﬁﬁk l
x
ﬁﬁl m
=>
ﬁﬁn p
x
ﬁﬁq r
.
ﬁﬁr s
entityId
ﬁﬁs {
==
ﬁﬁ| ~
reportmasterVMﬁﬁ ç
.ﬁﬁç é
entityIdﬁﬁé ñ
&&ﬁﬁó ô
xﬁﬁö õ
.ﬁﬁõ ú$
reportGenerationTypeﬁﬁú ∞
==ﬁﬁ± ≥
(ﬁﬁ¥ µ
(ﬁﬁµ ∂
intﬁﬁ∂ π
)ﬁﬁπ ∫
ReportCategoryﬁﬁ∫ »
.ﬁﬁ» …%
SystemGeneratedReportﬁﬁ… ﬁ
)ﬁﬁﬁ ﬂ
.ﬁﬁﬂ ‡
ToStringﬁﬁ‡ Ë
(ﬁﬁË È
)ﬁﬁÈ Í
&&ﬁﬁÎ Ì
xﬁﬁÓ Ô
.ﬁﬁÔ 
	isDeletedﬁﬁ ˘
==ﬁﬁ˙ ¸
falseﬁﬁ˝ Ç
)ﬁﬁÇ É
;ﬁﬁÉ Ñ
if
ﬂﬂ 
(
ﬂﬂ #
systemGeneratedReport
ﬂﬂ 1
!=
ﬂﬂ2 4
null
ﬂﬂ5 9
)
ﬂﬂ9 :
{
‡‡ 
if
·· 
(
··  #
systemGeneratedReport
··  5
.
··5 6
id
··6 8
==
··9 ;
reportmasterVM
··< J
.
··J K
id
··K M
)
··M N
{
··O P
flag
··Q U
=
··V W
true
··X \
;
··\ ]
}
··^ _
else
‚‚  
{
„„ #
systemGeneratedReport
‰‰  5
.
‰‰5 6
isDefaultReport
‰‰6 E
=
‰‰F G
true
‰‰H L
;
‰‰L M#
systemGeneratedReport
ÂÂ  5
.
ÂÂ5 6
	updatedAt
ÂÂ6 ?
=
ÂÂ@ A
StaticMethods
ÂÂB O
.
ÂÂO P
GetUtcDateTime
ÂÂP ^
(
ÂÂ^ _
)
ÂÂ_ `
;
ÂÂ` a#
systemGeneratedReport
ÊÊ  5
.
ÊÊ5 6
	updatedBy
ÊÊ6 ?
=
ÊÊ@ A
reportmasterVM
ÊÊB P
.
ÊÊP Q
userId
ÊÊQ W
.
ÊÊW X
ToString
ÊÊX `
(
ÊÊ` a
)
ÊÊa b
;
ÊÊb c#
systemGeneratedReport
ÁÁ  5
.
ÁÁ5 6
updateByRoleId
ÁÁ6 D
=
ÁÁE F
reportmasterVM
ÁÁG U
.
ÁÁU V

userRoleId
ÁÁV `
;
ÁÁ` a
}
ËË 
}
ÈÈ 
}
ÍÍ 
if
ÏÏ 
(
ÏÏ 
reportmasterData
ÏÏ (
==
ÏÏ) +
null
ÏÏ, 0
)
ÏÏ0 1
{
ÌÌ 
var
ÓÓ 
notFoundMSG
ÓÓ '
=
ÓÓ( )
await
ÓÓ* /$
_dynamicMessageService
ÓÓ0 F
.
ÓÓF G
Get
ÓÓG J
(
ÓÓJ K
	NOT_FOUND
ÓÓK T
)
ÓÓT U
;
ÓÓU V
return
ÔÔ '
_iHttpsResponseRepository
ÔÔ 8
.
ÔÔ8 9
ReturnResult
ÔÔ9 E
(
ÔÔE F
APIStatusCode
ÔÔF S
.
ÔÔS T
ERROR
ÔÔT Y
,
ÔÔY Z
APIState
ÔÔ[ c
.
ÔÔc d
FAILED
ÔÔd j
,
ÔÔj k
null
ÔÔl p
,
ÔÔp q
new
ÔÔr u
UserMessageÔÔv Å
(ÔÔÅ Ç
)ÔÔÇ É
{ÔÔÑ Ö
messageContentÔÔÜ î
=ÔÔï ñ
newÔÔó ö
MessageContentÔÔõ ©
{ÔÔ™ ´
messageTypeÔÔ¨ ∑
=ÔÔ∏ π
notFoundMSGÔÔ∫ ≈
.ÔÔ≈ ∆
messageTypeÔÔ∆ —
,ÔÔ— “
messageCodeÔÔ” ﬁ
=ÔÔﬂ ‡
notFoundMSGÔÔ· Ï
.ÔÔÏ Ì
messageCodeÔÔÌ ¯
,ÔÔ¯ ˘
messageÔÔ˙ Å
=ÔÔÇ É
stringÔÔÑ ä
.ÔÔä ã
FormatÔÔã ë
(ÔÔë í
notFoundMSGÔÔí ù
.ÔÔù û
messageÔÔû •
,ÔÔ• ¶
REPORT_DETAILSÔÔß µ
)ÔÔµ ∂
}ÔÔ∑ ∏
}ÔÔπ ∫
)ÔÔ∫ ª
;ÔÔª º
}
 
if
ÒÒ 
(
ÒÒ 
reportmasterData
ÒÒ (
.
ÒÒ( )
	editingBy
ÒÒ) 2
!=
ÒÒ3 5
null
ÒÒ6 :
)
ÒÒ: ;
{
ÚÚ 
var
ÛÛ  
activityStartedMSG
ÛÛ .
=
ÛÛ/ 0
await
ÛÛ1 6$
_dynamicMessageService
ÛÛ7 M
.
ÛÛM N
Get
ÛÛN Q
(
ÛÛQ R&
ACTIVITY_ALREADY_STARTED
ÛÛR j
)
ÛÛj k
;
ÛÛk l
return
ÙÙ '
_iHttpsResponseRepository
ÙÙ 8
.
ÙÙ8 9
ReturnResult
ÙÙ9 E
(
ÙÙE F
APIStatusCode
ÙÙF S
.
ÙÙS T
ERROR
ÙÙT Y
,
ÙÙY Z
APIState
ÙÙ[ c
.
ÙÙc d
FAILED
ÙÙd j
,
ÙÙj k
null
ÙÙl p
,
ÙÙp q
new
ÙÙr u
UserMessageÙÙv Å
(ÙÙÅ Ç
)ÙÙÇ É
{ÙÙÑ Ö
messageContentÙÙÜ î
=ÙÙï ñ
newÙÙó ö
MessageContentÙÙõ ©
{ÙÙ™ ´
messageTypeÙÙ¨ ∑
=ÙÙ∏ π"
activityStartedMSGÙÙ∫ Ã
.ÙÙÃ Õ
messageTypeÙÙÕ ÿ
,ÙÙÿ Ÿ
messageCodeÙÙ⁄ Â
=ÙÙÊ Á"
activityStartedMSGÙÙË ˙
.ÙÙ˙ ˚
messageCodeÙÙ˚ Ü
,ÙÙÜ á
messageÙÙà è
=ÙÙê ë
stringÙÙí ò
.ÙÙò ô
FormatÙÙô ü
(ÙÙü †"
activityStartedMSGÙÙ† ≤
.ÙÙ≤ ≥
messageÙÙ≥ ∫
,ÙÙ∫ ª
GetUserNameByIdÙÙº À
(ÙÙÀ Ã 
reportmasterDataÙÙÃ ‹
.ÙÙ‹ ›
	editingByÙÙ› Ê
)ÙÙÊ Á
,ÙÙÁ Ë 
reportmasterDataÙÙÈ ˘
.ÙÙ˘ ˙"
startDesigningDateÙÙ˙ å
.ÙÙå ç
ValueÙÙç í
.ÙÙí ì
ToLocalTimeÙÙì û
(ÙÙû ü
)ÙÙü †
)ÙÙ† °
}ÙÙ¢ £
}ÙÙ§ •
)ÙÙ• ¶
;ÙÙ¶ ß
}
ıı 
reportmasterData
ˆˆ $
.
ˆˆ$ %

reportName
ˆˆ% /
=
ˆˆ0 1

reportName
ˆˆ2 <
;
ˆˆ< =
reportmasterData
˜˜ $
.
˜˜$ %
reportTitle
˜˜% 0
=
˜˜1 2
reportmasterVM
˜˜3 A
.
˜˜A B
reportTitle
˜˜B M
;
˜˜M N
reportmasterData
¯¯ $
.
¯¯$ %
entityId
¯¯% -
=
¯¯. /
entityId
¯¯0 8
==
¯¯9 ;
$num
¯¯< =
?
¯¯> ?
null
¯¯@ D
:
¯¯E F
entityId
¯¯G O
;
¯¯O P
if
˘˘ 
(
˘˘ 
reportmasterVM
˘˘ &
.
˘˘& '
gencCategoryID
˘˘' 5
==
˘˘6 8
$num
˘˘9 :
)
˘˘: ;
{
˙˙ 
reportmasterVM
˚˚ &
.
˚˚& '
gencCategoryID
˚˚' 5
=
˚˚6 7
null
˚˚8 <
;
˚˚< =
}
¸¸ 
reportmasterData
˝˝ $
.
˝˝$ %
reportCategoryId
˝˝% 5
=
˝˝6 7
reportmasterVM
˝˝8 F
.
˝˝F G
gencCategoryID
˝˝G U
;
˝˝U V
reportmasterData
˛˛ $
.
˛˛$ %
reportViewType
˛˛% 3
=
˛˛4 5
reportmasterVM
˛˛6 D
.
˛˛D E

reportType
˛˛E O
==
˛˛P R
(
˛˛S T
(
˛˛T U
int
˛˛U X
)
˛˛X Y

ReportType
˛˛Y c
.
˛˛c d
Detail
˛˛d j
)
˛˛j k
;
˛˛k l
reportmasterData
ˇˇ $
.
ˇˇ$ %
additionalNotes
ˇˇ% 4
=
ˇˇ5 6
reportmasterVM
ˇˇ7 E
.
ˇˇE F
additionalNotes
ˇˇF U
;
ˇˇU V
reportmasterData
ÄÄ $
.
ÄÄ$ %
isDefaultReport
ÄÄ% 4
=
ÄÄ5 6
flag
ÄÄ7 ;
||
ÄÄ< >
reportmasterVM
ÄÄ? M
.
ÄÄM N
isDefaultReport
ÄÄN ]
;
ÄÄ] ^
reportmasterData
ÅÅ $
.
ÅÅ$ %
	updatedAt
ÅÅ% .
=
ÅÅ/ 0
StaticMethods
ÅÅ1 >
.
ÅÅ> ?
GetUtcDateTime
ÅÅ? M
(
ÅÅM N
)
ÅÅN O
;
ÅÅO P
reportmasterData
ÇÇ $
.
ÇÇ$ %
	updatedBy
ÇÇ% .
=
ÇÇ/ 0
reportmasterVM
ÇÇ1 ?
.
ÇÇ? @
userId
ÇÇ@ F
.
ÇÇF G
ToString
ÇÇG O
(
ÇÇO P
)
ÇÇP Q
;
ÇÇQ R
reportmasterData
ÉÉ $
.
ÉÉ$ %
updateByRoleId
ÉÉ% 3
=
ÉÉ4 5
reportmasterVM
ÉÉ6 D
.
ÉÉD E

userRoleId
ÉÉE O
;
ÉÉO P
await
ÑÑ 
_FJTSqlDBContext
ÑÑ *
.
ÑÑ* +
SaveChangesAsync
ÑÑ+ ;
(
ÑÑ; <
)
ÑÑ< =
;
ÑÑ= >
reportIdModel
ÜÜ !
.
ÜÜ! "
Id
ÜÜ" $
=
ÜÜ% &
reportmasterVM
ÜÜ' 5
.
ÜÜ5 6
id
ÜÜ6 8
;
ÜÜ8 9
reportIdModel
áá !
.
áá! "
fileName
áá" *
=
áá+ ,
reportmasterData
áá- =
.
áá= >
fileName
áá> F
;
ááF G
var
ââ 

resMessage
ââ "
=
ââ# $
await
ââ% *$
_dynamicMessageService
ââ+ A
.
ââA B
Get
ââB E
(
ââE F
UPDATED
ââF M
)
ââM N
;
ââN O
return
ää '
_iHttpsResponseRepository
ää 4
.
ää4 5
ReturnResult
ää5 A
(
ääA B
APIStatusCode
ääB O
.
ääO P
SUCCESS
ääP W
,
ääW X
APIState
ääY a
.
ääa b
SUCCESS
ääb i
,
ääi j
reportIdModel
ääk x
,
ääx y
new
ääz }
UserMessageää~ â
(ääâ ä
)äää ã
{ääå ç
messageääé ï
=ääñ ó
stringääò û
.ääû ü
Formatääü •
(ää• ¶

resMessageää¶ ∞
.ää∞ ±
messageää± ∏
,ää∏ π
REPORT_ENTITYää∫ «
)ää« »
}ää…  
)ää  À
;ääÀ Ã
}
ãã 
else
åå 
{
çç 
var
èè 
reportNameUnique
èè (
=
èè) *
await
èè+ 0
_FJTSqlDBContext
èè1 A
.
èèA B
reportmaster
èèB N
.
èèN O
AnyAsync
èèO W
(
èèW X
x
èèX Y
=>
èèZ \
x
èè] ^
.
èè^ _

reportName
èè_ i
==
èèj l

reportName
èèm w
&&
èèx z
x
èè{ |
.
èè| }
	isDeletedèè} Ü
==èèá â
falseèèä è
)èèè ê
;èèê ë
if
êê 
(
êê 
reportNameUnique
êê (
==
êê) +
true
êê, 0
)
êê0 1
{
ëë 
var
íí 
uniqueNameMSG
íí )
=
íí* +
await
íí, 1$
_dynamicMessageService
íí2 H
.
ííH I
Get
ííI L
(
ííL M 
MUST_UNIQUE_GLOBAL
ííM _
)
íí_ `
;
íí` a
return
ìì '
_iHttpsResponseRepository
ìì 8
.
ìì8 9
ReturnResult
ìì9 E
(
ììE F
APIStatusCode
ììF S
.
ììS T
ERROR
ììT Y
,
ììY Z
APIState
ìì[ c
.
ììc d
FAILED
ììd j
,
ììj k
null
ììl p
,
ììp q
new
ììr u
UserMessageììv Å
(ììÅ Ç
)ììÇ É
{ììÑ Ö
messageContentììÜ î
=ììï ñ
newììó ö
MessageContentììõ ©
{ìì™ ´
messageTypeìì¨ ∑
=ìì∏ π
uniqueNameMSGìì∫ «
.ìì« »
messageTypeìì» ”
,ìì” ‘
messageCodeìì’ ‡
=ìì· ‚
uniqueNameMSGìì„ 
.ìì Ò
messageCodeììÒ ¸
,ìì¸ ˝
messageìì˛ Ö
=ììÜ á
stringììà é
.ììé è
Formatììè ï
(ììï ñ
uniqueNameMSGììñ £
.ìì£ §
messageìì§ ´
,ìì´ ¨
REPORT_NAMEìì≠ ∏
)ìì∏ π
}ìì∫ ª
}ììº Ω
)ììΩ æ
;ììæ ø
}
îî 
int
òò 
?
òò 
templateReportId
òò )
=
òò* +
null
òò, 0
;
òò0 1
var
ôô &
templateReportFolderPath
ôô 0
=
ôô1 2
string
ôô3 9
.
ôô9 :
Empty
ôô: ?
;
ôô? @
if
öö 
(
öö 
reportmasterVM
öö &
.
öö& '
reportCreateType
öö' 7
==
öö8 :
(
öö; <
int
öö< ?
)
öö? @
ReportCreateType
öö@ P
.
ööP Q
CloneFromReport
ööQ `
)
öö` a
{
õõ &
templateReportFolderPath
úú 0
=
úú1 2
reportmasterVM
úú3 A
.
úúA B
isEndUserReport
úúB Q
?
úúR S

reportPath
úúT ^
:
úú_ `
(
úúa b
reportmasterVM
úúb p
.
úúp q#
reportGenerationTypeúúq Ö
==úúÜ à
(úúâ ä
(úúä ã
intúúã é
)úúé è
ReportCategoryúúè ù
.úúù û%
SystemGeneratedReportúúû ≥
)úú≥ ¥
.úú¥ µ
ToStringúúµ Ω
(úúΩ æ
)úúæ ø
?úú¿ ¡
_constantPathúú¬ œ
.úúœ –)
SystemGeneratedReportPathúú– È
:úúÍ Î
_constantPathúúÏ ˘
.úú˘ ˙"
TemplateReportPathúú˙ å
)úúå ç
;úúç é
templateReportId
ùù (
=
ùù) *
reportmasterVM
ùù+ 9
.
ùù9 :
refReportId
ùù: E
;
ùùE F
}
ûû 
else
üü 
{
†† 
templateReportId
°° (
=
°°) *
reportmasterVM
°°+ 9
.
°°9 :

templateId
°°: D
!=
°°E G
$num
°°H I
?
°°J K
reportmasterVM
°°L Z
.
°°Z [

templateId
°°[ e
:
°°f g
null
°°h l
;
°°l m#
newReportFromTemplate
¢¢ -
=
¢¢. /
true
¢¢0 4
;
¢¢4 5&
templateReportFolderPath
££ 0
=
££1 2
_constantPath
££3 @
.
££@ A 
TemplateReportPath
££A S
;
££S T
}
§§ 
if
¶¶ 
(
¶¶ 
templateReportId
¶¶ (
!=
¶¶) +
null
¶¶, 0
)
¶¶0 1
{
ßß 
var
©©  
templateReportData
©© .
=
©©/ 0
await
©©1 6
_FJTSqlDBContext
©©7 G
.
©©G H
reportmaster
©©H T
.
©©T U!
FirstOrDefaultAsync
©©U h
(
©©h i
x
©©i j
=>
©©k m
x
©©n o
.
©©o p
id
©©p r
==
©©s u
templateReportId©©v Ü
&&©©á â
x©©ä ã
.©©ã å
	isDeleted©©å ï
==©©ñ ò
false©©ô û
)©©û ü
;©©ü †
if
™™ 
(
™™  
templateReportData
™™ .
==
™™/ 1
null
™™2 6
)
™™6 7
{
´´ 
var
¨¨ 
notFoundMSG
¨¨  +
=
¨¨, -
await
¨¨. 3$
_dynamicMessageService
¨¨4 J
.
¨¨J K
Get
¨¨K N
(
¨¨N O
	NOT_FOUND
¨¨O X
)
¨¨X Y
;
¨¨Y Z
return
≠≠ "'
_iHttpsResponseRepository
≠≠# <
.
≠≠< =
ReturnResult
≠≠= I
(
≠≠I J
APIStatusCode
≠≠J W
.
≠≠W X
ERROR
≠≠X ]
,
≠≠] ^
APIState
≠≠_ g
.
≠≠g h
FAILED
≠≠h n
,
≠≠n o
null
≠≠p t
,
≠≠t u
new
≠≠v y
UserMessage≠≠z Ö
(≠≠Ö Ü
)≠≠Ü á
{≠≠à â
messageContent≠≠ä ò
=≠≠ô ö
new≠≠õ û
MessageContent≠≠ü ≠
{≠≠Æ Ø
messageType≠≠∞ ª
=≠≠º Ω
notFoundMSG≠≠æ …
.≠≠…  
messageType≠≠  ’
,≠≠’ ÷
messageCode≠≠◊ ‚
=≠≠„ ‰
notFoundMSG≠≠Â 
.≠≠ Ò
messageCode≠≠Ò ¸
,≠≠¸ ˝
message≠≠˛ Ö
=≠≠Ü á
string≠≠à é
.≠≠é è
Format≠≠è ï
(≠≠ï ñ
notFoundMSG≠≠ñ °
.≠≠° ¢
message≠≠¢ ©
,≠≠© ™%
newReportFromTemplate≠≠´ ¿
?≠≠¡ ¬ 
TEMPLATE_DETAILS≠≠√ ”
:≠≠‘ ’!
COPY_FROM_DETAILS≠≠÷ Á
)≠≠Á Ë
}≠≠È Í
}≠≠Î Ï
)≠≠Ï Ì
;≠≠Ì Ó
}
ÆÆ  
templateReportPath
≥≥ *
=
≥≥+ ,&
templateReportFolderPath
≥≥- E
+
≥≥F G 
templateReportData
≥≥H Z
.
≥≥Z [
fileName
≥≥[ c
+
≥≥d e
REPORT_EXTENSION
≥≥f v
;
≥≥v w
if
¥¥ 
(
¥¥ 
!
¥¥ 
(
¥¥ 
System
¥¥ $
.
¥¥$ %
IO
¥¥% '
.
¥¥' (
File
¥¥( ,
.
¥¥, -
Exists
¥¥- 3
(
¥¥3 4 
templateReportPath
¥¥4 F
)
¥¥F G
)
¥¥G H
)
¥¥H I
{
µµ 
var
∂∂ 
notExistsMSG
∂∂  ,
=
∂∂- .
await
∂∂/ 4$
_dynamicMessageService
∂∂5 K
.
∂∂K L
Get
∂∂L O
(
∂∂O P
$str
∂∂P \
)
∂∂\ ]
;
∂∂] ^
return
∑∑ "'
_iHttpsResponseRepository
∑∑# <
.
∑∑< =
ReturnResult
∑∑= I
(
∑∑I J
APIStatusCode
∑∑J W
.
∑∑W X
ERROR
∑∑X ]
,
∑∑] ^
APIState
∑∑_ g
.
∑∑g h
FAILED
∑∑h n
,
∑∑n o
null
∑∑p t
,
∑∑t u
new
∑∑v y
UserMessage∑∑z Ö
(∑∑Ö Ü
)∑∑Ü á
{∑∑à â
messageContent∑∑ä ò
=∑∑ô ö
new∑∑õ û
MessageContent∑∑ü ≠
{∑∑Æ Ø
messageType∑∑∞ ª
=∑∑º Ω
notExistsMSG∑∑æ  
.∑∑  À
messageType∑∑À ÷
,∑∑÷ ◊
messageCode∑∑ÿ „
=∑∑‰ Â
notExistsMSG∑∑Ê Ú
.∑∑Ú Û
messageCode∑∑Û ˛
,∑∑˛ ˇ
message∑∑Ä á
=∑∑à â
string∑∑ä ê
.∑∑ê ë
Format∑∑ë ó
(∑∑ó ò
notExistsMSG∑∑ò §
.∑∑§ •
message∑∑• ¨
,∑∑¨ ≠%
newReportFromTemplate∑∑Æ √
?∑∑ƒ ≈
TEMPLATE∑∑∆ Œ
:∑∑œ –
	COPY_FROM∑∑— ⁄
)∑∑⁄ €
}∑∑‹ ›
}∑∑ﬁ ﬂ
)∑∑ﬂ ‡
;∑∑‡ ·
}
∏∏ 
}
ππ 
List
ªª 
<
ªª #
reportmasterparameter
ªª .
>
ªª. /$
reportmasterparameters
ªª0 F
=
ªªG H
new
ªªI L
List
ªªM Q
<
ªªQ R#
reportmasterparameter
ªªR g
>
ªªg h
(
ªªh i
)
ªªi j
;
ªªj k
var
ºº 
refReportId
ºº #
=
ºº$ %#
newReportFromTemplate
ºº& ;
?
ºº< =
null
ºº> B
:
ººC D
reportmasterVM
ººE S
.
ººS T
refReportId
ººT _
;
ºº_ `
if
ΩΩ 
(
ΩΩ 
refReportId
ΩΩ #
!=
ΩΩ$ &
null
ΩΩ' +
)
ΩΩ+ ,
{
ææ 
var
øø #
requiredParameterList
øø 1
=
øø2 3
await
øø4 9
_FJTSqlDBContext
øø: J
.
øøJ K#
reportmasterparameter
øøK `
.
øø` a
Where
øøa f
(
øøf g
x
øøg h
=>
øøi k
x
øøl m
.
øøm n
reportId
øøn v
==
øøw y
refReportIdøøz Ö
&&øøÜ à
xøøâ ä
.øøä ã
	isDeletedøøã î
==øøï ó
falseøøò ù
)øøù û
.øøû ü
Selectøøü •
(øø• ¶
xøø¶ ß
=>øø® ™
newøø´ Æ
{øøØ ∞
xøø± ≤
.øø≤ ≥!
parmeterMappingidøø≥ ƒ
,øøƒ ≈
xøø∆ «
.øø« »

isRequiredøø» “
}øø” ‘
)øø‘ ’
.øø’ ÷
ToListAsyncøø÷ ·
(øø· ‚
)øø‚ „
;øø„ ‰
foreach
¿¿ 
(
¿¿  !
var
¿¿! $
item
¿¿% )
in
¿¿* ,#
requiredParameterList
¿¿- B
)
¿¿B C
{
¡¡ #
reportmasterparameter
¬¬ 1#
reportmasterparameter
¬¬2 G
=
¬¬H I
new
¬¬J M#
reportmasterparameter
¬¬N c
{
√√ 
parmeterMappingid
ƒƒ  1
=
ƒƒ2 3
item
ƒƒ4 8
.
ƒƒ8 9
parmeterMappingid
ƒƒ9 J
,
ƒƒJ K

isRequired
≈≈  *
=
≈≈+ ,
item
≈≈- 1
.
≈≈1 2

isRequired
≈≈2 <
,
≈≈< =
	createdBy
∆∆  )
=
∆∆* +
reportmasterVM
∆∆, :
.
∆∆: ;
userId
∆∆; A
.
∆∆A B
ToString
∆∆B J
(
∆∆J K
)
∆∆K L
,
∆∆L M
createByRoleId
««  .
=
««/ 0
reportmasterVM
««1 ?
.
««? @

userRoleId
««@ J
,
««J K
	createdAt
»»  )
=
»»* +
StaticMethods
»», 9
.
»»9 :
GetUtcDateTime
»»: H
(
»»H I
)
»»I J
}
…… 
;
…… $
reportmasterparameters
   2
.
  2 3
Add
  3 6
(
  6 7#
reportmasterparameter
  7 L
)
  L M
;
  M N
}
ÀÀ 
}
ÃÃ 
reportmaster
ŒŒ  
reportMasterObj
ŒŒ! 0
=
ŒŒ1 2
new
ŒŒ3 6
reportmaster
ŒŒ7 C
{
œœ 

reportName
–– "
=
––# $

reportName
––% /
,
––/ 0 
rdlcReportFileName
—— *
=
——+ ,

reportName
——- 7
,
——7 8
reportTitle
““ #
=
““$ %
reportmasterVM
““& 4
.
““4 5
reportTitle
““5 @
,
““@ A
entityId
””  
=
””! "
entityId
””# +
==
””, .
$num
””/ 0
?
””1 2
null
””3 7
:
””8 9
entityId
””: B
,
””B C
reportCategoryId
‘‘ (
=
‘‘) *
reportCategoryId
‘‘+ ;
==
‘‘< >
$num
‘‘? @
?
‘‘A B
null
‘‘C G
:
‘‘H I
reportCategoryId
‘‘J Z
,
‘‘Z [
reportViewType
’’ &
=
’’' (
reportmasterVM
’’) 7
.
’’7 8

reportType
’’8 B
==
’’C E
(
’’F G
int
’’G J
)
’’J K

ReportType
’’K U
.
’’U V
Detail
’’V \
,
’’\ ]
isEndUserReport
÷÷ '
=
÷÷( )
true
÷÷* .
,
÷÷. /
fileName
◊◊  
=
◊◊! "
System
◊◊# )
.
◊◊) *
Guid
◊◊* .
.
◊◊. /
NewGuid
◊◊/ 6
(
◊◊6 7
)
◊◊7 8
.
◊◊8 9
ToString
◊◊9 A
(
◊◊A B
)
◊◊B C
,
◊◊C D
refReportId
ÿÿ #
=
ÿÿ$ %
refReportId
ÿÿ& 1
,
ÿÿ1 2
status
ŸŸ 
=
ŸŸ  
ReportStatus
ŸŸ! -
.
ŸŸ- .
Draft
ŸŸ. 3
.
ŸŸ3 4
GetDisplayValue
ŸŸ4 C
(
ŸŸC D
)
ŸŸD E
,
ŸŸE F"
reportGenerationType
⁄⁄ ,
=
⁄⁄- .
reportmasterVM
⁄⁄/ =
.
⁄⁄= >"
reportGenerationType
⁄⁄> R
==
⁄⁄S U
(
⁄⁄V W
(
⁄⁄W X
int
⁄⁄X [
)
⁄⁄[ \
ReportCategory
⁄⁄\ j
.
⁄⁄j k
TemplateReport
⁄⁄k y
)
⁄⁄y z
.
⁄⁄z {
ToString⁄⁄{ É
(⁄⁄É Ñ
)⁄⁄Ñ Ö
?⁄⁄Ü á
(⁄⁄à â
(⁄⁄â ä
int⁄⁄ä ç
)⁄⁄ç é
ReportCategory⁄⁄é ú
.⁄⁄ú ù
TemplateReport⁄⁄ù ´
)⁄⁄´ ¨
.⁄⁄¨ ≠
ToString⁄⁄≠ µ
(⁄⁄µ ∂
)⁄⁄∂ ∑
:⁄⁄∏ π
(⁄⁄∫ ª
(⁄⁄ª º
int⁄⁄º ø
)⁄⁄ø ¿
ReportCategory⁄⁄¿ Œ
.⁄⁄Œ œ
EndUserReport⁄⁄œ ‹
)⁄⁄‹ ›
.⁄⁄› ﬁ
ToString⁄⁄ﬁ Ê
(⁄⁄Ê Á
)⁄⁄Á Ë
,⁄⁄Ë È
	createdBy
€€ !
=
€€" #
reportmasterVM
€€$ 2
.
€€2 3
userId
€€3 9
.
€€9 :
ToString
€€: B
(
€€B C
)
€€C D
,
€€D E
createByRoleId
‹‹ &
=
‹‹' (
reportmasterVM
‹‹) 7
.
‹‹7 8

userRoleId
‹‹8 B
,
‹‹B C
	createdAt
›› !
=
››" #
StaticMethods
››$ 1
.
››1 2
GetUtcDateTime
››2 @
(
››@ A
)
››A B
,
››B C
additionalNotes
ﬁﬁ '
=
ﬁﬁ( )
reportmasterVM
ﬁﬁ* 8
.
ﬁﬁ8 9
additionalNotes
ﬁﬁ9 H
,
ﬁﬁH I
isDefaultReport
ﬂﬂ '
=
ﬂﬂ( )
reportmasterVM
ﬂﬂ* 8
.
ﬂﬂ8 9
isDefaultReport
ﬂﬂ9 H
,
ﬂﬂH I$
reportmasterparameters
‡‡ .
=
‡‡/ 0$
reportmasterparameters
‡‡1 G
}
·· 
;
·· 
_FJTSqlDBContext
‚‚ $
.
‚‚$ %
reportmaster
‚‚% 1
.
‚‚1 2
Add
‚‚2 5
(
‚‚5 6
reportMasterObj
‚‚6 E
)
‚‚E F
;
‚‚F G
await
„„ 
_FJTSqlDBContext
„„ *
.
„„* +
SaveChangesAsync
„„+ ;
(
„„; <
)
„„< =
;
„„= >
reportIdModel
ÂÂ !
.
ÂÂ! "
Id
ÂÂ" $
=
ÂÂ% &
reportMasterObj
ÂÂ' 6
.
ÂÂ6 7
id
ÂÂ7 9
;
ÂÂ9 :
reportIdModel
ÊÊ !
.
ÊÊ! "
fileName
ÊÊ" *
=
ÊÊ+ ,
reportMasterObj
ÊÊ- <
.
ÊÊ< =
fileName
ÊÊ= E
;
ÊÊE F
System
ÈÈ 
.
ÈÈ 
IO
ÈÈ 
.
ÈÈ 
	Directory
ÈÈ '
.
ÈÈ' (
CreateDirectory
ÈÈ( 7
(
ÈÈ7 8

reportPath
ÈÈ8 B
)
ÈÈB C
;
ÈÈC D
var
ÍÍ 
reportWithPath
ÍÍ &
=
ÍÍ' (

reportPath
ÍÍ) 3
+
ÍÍ4 5
reportMasterObj
ÍÍ6 E
.
ÍÍE F
fileName
ÍÍF N
+
ÍÍO P
REPORT_EXTENSION
ÍÍQ a
;
ÍÍa b
if
ÎÎ 
(
ÎÎ 
templateReportId
ÎÎ (
!=
ÎÎ) +
null
ÎÎ, 0
)
ÎÎ0 1
{
ÏÏ 
System
ÓÓ 
.
ÓÓ 
IO
ÓÓ !
.
ÓÓ! "
File
ÓÓ" &
.
ÓÓ& '
Copy
ÓÓ' +
(
ÓÓ+ , 
templateReportPath
ÓÓ, >
,
ÓÓ> ?
reportWithPath
ÓÓ@ N
)
ÓÓN O
;
ÓÓO P
}
ÔÔ 
else
 
{
ÒÒ 
var
ÛÛ 
report
ÛÛ "
=
ÛÛ# $
new
ÛÛ% (
	StiReport
ÛÛ) 2
(
ÛÛ2 3
)
ÛÛ3 4
;
ÛÛ4 5
StiMySqlDatabase
ÙÙ (
db
ÙÙ) +
=
ÙÙ, -
new
ÙÙ. 1
StiMySqlDatabase
ÙÙ2 B
(
ÙÙB C"
REPORT_DATABASE_NAME
ÙÙC W
,
ÙÙW X"
REPORT_DATABASE_NAME
ÙÙY m
,
ÙÙm n!
_connectionStringsÙÙo Å
.ÙÙÅ Ç 
ReportConnectionÙÙÇ í
)ÙÙí ì
;ÙÙì î
report
ıı 
.
ıı 

Dictionary
ıı )
.
ıı) *
	Databases
ıı* 3
.
ıı3 4
Add
ıı4 7
(
ıı7 8
db
ıı8 :
)
ıı: ;
;
ıı; <
report
ˆˆ 
.
ˆˆ 
Save
ˆˆ #
(
ˆˆ# $
reportWithPath
ˆˆ$ 2
)
ˆˆ2 3
;
ˆˆ3 4
}
˜˜ 
var
¯¯ 

resMessage
¯¯ "
=
¯¯# $
await
¯¯% *$
_dynamicMessageService
¯¯+ A
.
¯¯A B
Get
¯¯B E
(
¯¯E F
CREATED
¯¯F M
)
¯¯M N
;
¯¯N O
return
˘˘ '
_iHttpsResponseRepository
˘˘ 4
.
˘˘4 5
ReturnResult
˘˘5 A
(
˘˘A B
APIStatusCode
˘˘B O
.
˘˘O P
SUCCESS
˘˘P W
,
˘˘W X
APIState
˘˘Y a
.
˘˘a b
SUCCESS
˘˘b i
,
˘˘i j
reportIdModel
˘˘k x
,
˘˘x y
new
˘˘z }
UserMessage˘˘~ â
(˘˘â ä
)˘˘ä ã
{˘˘å ç
message˘˘é ï
=˘˘ñ ó
string˘˘ò û
.˘˘û ü
Format˘˘ü •
(˘˘• ¶

resMessage˘˘¶ ∞
.˘˘∞ ±
message˘˘± ∏
,˘˘∏ π
REPORT_ENTITY˘˘∫ «
)˘˘« »
}˘˘…  
)˘˘  À
;˘˘À Ã
}
˙˙ 
}
˚˚ 
catch
¸¸ 
(
¸¸ 
	Exception
¸¸ 
ex
¸¸ 
)
¸¸  
{
˝˝ 
_logger
˛˛ 
.
˛˛ 
LogError
˛˛  
(
˛˛  !
ex
˛˛! #
.
˛˛# $
ToString
˛˛$ ,
(
˛˛, -
)
˛˛- .
)
˛˛. /
;
˛˛/ 0
return
ˇˇ 
await
ˇˇ '
_iHttpsResponseRepository
ˇˇ 6
.
ˇˇ6 7%
ReturnExceptionResponse
ˇˇ7 N
(
ˇˇN O
ex
ˇˇO Q
)
ˇˇQ R
;
ˇˇR S
}
ÄÄ 
}
ÅÅ 	
public
ÉÉ 
async
ÉÉ 
Task
ÉÉ 
<
ÉÉ 
IActionResult
ÉÉ '
>
ÉÉ' (
Error
ÉÉ) .
(
ÉÉ. /
)
ÉÉ/ 0
{
ÑÑ 	
var
ÖÖ 
somethingWrongMSG
ÖÖ !
=
ÖÖ" #
await
ÖÖ$ )$
_dynamicMessageService
ÖÖ* @
.
ÖÖ@ A
Get
ÖÖA D
(
ÖÖD E
SOMTHING_WRONG
ÖÖE S
)
ÖÖS T
;
ÖÖT U
return
ÜÜ 
View
ÜÜ 
(
ÜÜ 
new
ÜÜ 
ErrorViewModel
ÜÜ *
{
ÜÜ+ ,

StatusCode
ÜÜ- 7
=
ÜÜ8 9
(
ÜÜ: ;
int
ÜÜ; >
)
ÜÜ> ?
APIStatusCode
ÜÜ? L
.
ÜÜL M#
INTERNAL_SERVER_ERROR
ÜÜM b
,
ÜÜb c
Message
ÜÜd k
=
ÜÜl m
somethingWrongMSG
ÜÜn 
.ÜÜ Ä
messageÜÜÄ á
}ÜÜà â
)ÜÜâ ä
;ÜÜä ã
}
áá 	
}
«« 
}»» Ÿ/
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\DesignReportController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
[ +
DeveloperAuthorizationAttribute $
]$ %
public 

class "
DesignReportController '
:( )
BaseController* 8
{ 
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
private 
readonly 
ILogger  
<  !
DesignerController! 3
>3 4
_logger5 <
;< =
static   "
DesignReportController   %
(  % &
)  & '
{!! 	

Stimulsoft## 
.## 
Base## 
.## 

StiLicense## &
.##& '
LoadFromFile##' 3
(##3 4
$str##4 A
)##A B
;##B C
}$$ 	
public%% "
DesignReportController%% %
(%%% &
FJTSqlDBContext%%& 5
fjtSqlDBContext%%6 E
,%%E F
IOptions%%G O
<%%O P
ConstantPath%%P \
>%%\ ]
constantPath%%^ j
,%%j k#
IDynamicMessageService	%%l Ç#
dynamicMessageService
%%É ò
,
%%ò ô
ILogger
%%ö °
<
%%° ¢ 
DesignerController
%%¢ ¥
>
%%¥ µ
logger
%%∂ º
)
%%º Ω
:
%%æ ø
base
%%¿ ƒ
(
%%ƒ ≈
fjtSqlDBContext
%%≈ ‘
,
%%‘ ’
constantPath
%%÷ ‚
)
%%‚ „
{&& 	
_constantPath'' 
='' 
constantPath'' (
.''( )
Value'') .
;''. /"
_dynamicMessageService(( "
=((# $!
dynamicMessageService((% :
;((: ;
_logger)) 
=)) 
logger)) 
;)) 
}** 	
public11 
IActionResult11 !
SystemGeneratedReport11 2
(112 3
)113 4
{22 	
return33 
View33 
(33 
)33 
;33 
}44 	
public;; 
async;; 
Task;; 
<;; 
IActionResult;; '
>;;' (
	GetReport;;) 2
(;;2 3
);;3 4
{<< 	
try== 
{>> 
var@@ 
report@@ 
=@@ 
new@@  
	StiReport@@! *
(@@* +
)@@+ ,
;@@, -
returnAA 
awaitAA 
StiNetCoreDesignerAA /
.AA/ 0 
GetReportResultAsyncAA0 D
(AAD E
thisAAE I
,AAI J
reportAAK Q
)AAQ R
;AAR S
}BB 
catchCC 
(CC 
	ExceptionCC 
eCC 
)CC 
{DD 
_loggerEE 
.EE 
LogErrorEE  
(EE  !
eEE! "
.EE" #
ToStringEE# +
(EE+ ,
)EE, -
)EE- .
;EE. /
varFF 
somethingWrongMSGFF %
=FF& '
awaitFF( -"
_dynamicMessageServiceFF. D
.FFD E
GetFFE H
(FFH I
SOMTHING_WRONGFFI W
)FFW X
;FFX Y
returnGG 
ViewGG 
(GG 
$strGG #
,GG# $
newGG% (
ErrorViewModelGG) 7
{GG8 9

StatusCodeGG: D
=GGE F
(GGG H
intGGH K
)GGK L
APIStatusCodeGGL Y
.GGY Z!
INTERNAL_SERVER_ERRORGGZ o
,GGo p
MessageGGq x
=GGy z
somethingWrongMSG	GG{ å
.
GGå ç
message
GGç î
}
GGï ñ
)
GGñ ó
;
GGó ò
}HH 
}II 	
publicOO 
asyncOO 
TaskOO 
<OO 
IActionResultOO '
>OO' (
DesignerEventOO) 6
(OO6 7
)OO7 8
{PP 	
returnQQ 
awaitQQ 
StiNetCoreDesignerQQ +
.QQ+ ,$
DesignerEventResultAsyncQQ, D
(QQD E
thisQQE I
)QQI J
;QQJ K
}RR 	
publicXX 
asyncXX 
TaskXX 
<XX 
IActionResultXX '
>XX' (
PreviewReportXX) 6
(XX6 7
)XX7 8
{YY 	
	StiReportZZ 
reportZZ 
=ZZ 
StiNetCoreDesignerZZ 1
.ZZ1 2!
GetActionReportObjectZZ2 G
(ZZG H
thisZZH L
)ZZL M
;ZZM N
return[[ 
await[[ 
StiNetCoreDesigner[[ +
.[[+ ,$
PreviewReportResultAsync[[, D
([[D E
this[[E I
,[[I J
report[[K Q
)[[Q R
;[[R S
}\\ 	
publicbb 
asyncbb 
Taskbb 
<bb 
IActionResultbb '
>bb' (

SaveReportbb) 3
(bb3 4
)bb4 5
{cc 	
returndd 
awaitdd 
StiNetCoreDesignerdd +
.dd+ ,!
SaveReportResultAsyncdd, A
(ddA B
thisddB F
)ddF G
;ddG H
}ee 	
publicgg 
asyncgg 
Taskgg 
<gg 
IActionResultgg '
>gg' (
Errorgg) .
(gg. /
)gg/ 0
{hh 	
varii 
somethingWrongMSGii !
=ii" #
awaitii$ )"
_dynamicMessageServiceii* @
.ii@ A
GetiiA D
(iiD E
SOMTHING_WRONGiiE S
)iiS T
;iiT U
returnjj 
Viewjj 
(jj 
newjj 
ErrorViewModeljj *
{jj+ ,

StatusCodejj- 7
=jj8 9
(jj: ;
intjj; >
)jj> ?
APIStatusCodejj? L
.jjL M!
INTERNAL_SERVER_ERRORjjM b
,jjb c
Messagejjd k
=jjl m
somethingWrongMSGjjn 
.	jj Ä
message
jjÄ á
}
jjà â
)
jjâ ä
;
jjä ã
}kk 	
}mm 
}nn ¿
\D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\DeveloperAuthorizationAttribute.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{		 
[

 
AttributeUsage

 
(

 
AttributeTargets

 $
.

$ %
Class

% *
)

* +
]

+ ,
public 

class +
DeveloperAuthorizationAttribute 0
:1 2
	Attribute3 <
,< = 
IAuthorizationFilter> R
{ 
public 
void 
OnAuthorization #
(# $&
AuthorizationFilterContext$ >
filterContext? L
)L M
{ 	
if 
( 
Startup 
. 
IsDevelopmentMode )
)) *
{ 
return 
; 
} 
else 
{ 
filterContext 
. 
HttpContext )
.) *
Response* 2
.2 3

StatusCode3 =
=> ?
(@ A
intA D
)D E
HttpStatusCodeE S
.S T
NotFoundT \
;\ ]
filterContext 
. 
Result $
=% &
new' *
	Microsoft+ 4
.4 5

AspNetCore5 ?
.? @
Mvc@ C
.C D!
RedirectToRouteResultD Y
(Y Z
newZ ] 
RouteValueDictionary^ r
(r s
news v
{w x

controller	y É
=
Ñ Ö
$str
Ü ë
,
ë í
action
ì ô
=
ö õ
$str
ú ¶
}
ß ®
)
® ©
)
© ™
;
™ ´
} 
} 	
} 
} …
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\LogOutController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
[ 
AllowAnonymous 
] 
public 

class 
LogOutController !
:" #

Controller$ .
{ 
private 
readonly  
IdentityserverConfig -!
_identityserverConfig. C
;C D
public 
LogOutController 
(  
IOptions! )
<) * 
IdentityserverConfig* >
>> ? 
identityserverConfig@ T
)T U
{ 	!
_identityserverConfig !
=" # 
identityserverConfig$ 8
.8 9
Value9 >
;> ?
} 	
public 
IActionResult 
LogOut #
(# $
)$ %
{ 	
return 
new 
SignOutResult $
($ %
new% (
[( )
]) *
{+ ,!
_identityserverConfig- B
.B C 
AuthenticationSchemeC W
,W X
ConstantHelperY g
.g h4
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME	h è
}
ê ë
)
ë í
;
í ì
} 	
public 
IActionResult 
SignoutCleanup +
(+ ,
string, 2
sid3 6
)6 7
{ 	
var 
claims 
= 
User 
as  
ClaimsPrincipal! 0
;0 1
var 
sidClaim 
= 
claims !
.! "
	FindFirst" +
(+ ,
$str, 1
)1 2
;2 3
if   
(   
sidClaim   
!=   
null    
&&  ! #
sidClaim  $ ,
.  , -
Value  - 2
==  3 5
sid  6 9
)  9 :
{!! 
HttpContext"" 
."" 
SignOutAsync"" (
(""( )!
_identityserverConfig"") >
.""> ? 
AuthenticationScheme""? S
)""S T
;""T U
foreach$$ 
($$ 
var$$ 
cookie$$ #
in$$$ &
Request$$' .
.$$. /
Cookies$$/ 6
.$$6 7
Keys$$7 ;
)$$; <
{%% 
Response&& 
.&& 
Cookies&& $
.&&$ %
Delete&&% +
(&&+ ,
cookie&&, 2
)&&2 3
;&&3 4
}'' 
}(( 
HttpContext)) 
.)) 
Session)) 
.))  
Remove))  &
())& '
$str))' 9
)))9 :
;)): ;
return++ 
Content++ 
(++ 
string++ !
.++! "
Empty++" '
)++' (
;++( )
},, 	
}-- 
}.. ø
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ConstantReportVariable.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
{		 
public 

enum "
ConstantReportVariable &
{ 
[ 	
Display	 
( 
Name 
= 
$str	 ª
)
ª º
]
º Ω,
 Para_DeclarationOfRoHSCompliance (
,( )
[ 	
Display	 
( 
Name 
= 
$str	 á
)
á à
]
à â%
Para_COFCReportDisclaimer !
,! "
[ 	
Display	 
( 
Name 
= 
$str	 Ç
)
Ç É
]
É Ñ,
 Para_PACKINGSLIPReportDisclaimer (
,( )
[ 	
Display	 
( 
Name 
= 
$str	 °
)
° ¢
]
¢ £%
Para_RoHSReportDisclaimer !
} 
} Ë
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportCategory.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
{ 
public		 

enum		 
ReportCategory		 
{

 
[ 	
Display	 
( 
Name 
= 
$str %
)% &
]& '
SaticReport 
= 
$num 
, 
[ 	
Display	 
( 
Name 
= 
$str '
)' (
]( )
EndUserReport 
= 
$num 
, 
[ 	
Display	 
( 
Name 
= 
$str (
)( )
]) *
TemplateReport 
= 
$num 
, 
[ 	
Display	 
( 
Name 
= 
$str /
)/ 0
]0 1!
SystemGeneratedReport 
= 
$num  !
} 
} ã
GD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportCreateType.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
{ 
public		 

enum		 
ReportCreateType		  
{

 
[ 	
Display	 
( 
Name 
= 
$str '
)' (
]( )
CloneFromTemplate 
, 
[ 	
Display	 
( 
Name 
= 
$str %
)% &
]& '
CloneFromReport 
} 
} Ò
CD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportStatus.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
{ 
public		 

enum		 
ReportStatus		 
{

 
[ 	
Display	 
( 
Name 
= 
$str 
) 
] 
Draft 
, 
[ 	
Display	 
( 
Name 
= 
$str 
) 
] 
	Published 
} 
} Ï
AD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportType.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
{ 
public		 

enum		 

ReportType		 
{

 
[ 	
Display	 
( 
Name 
= 
$str !
)! "
]" #
Summary 
, 
[ 	
Display	 
( 
Name 
= 
$str  
)  !
]! "
Detail 
} 
} Û7
FD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\ConstantHelper.cs
	namespace		 	
FJT		
 
.		 
ReportDesigner		 
.		 
Helper		 #
{

 
public 

class 
ConstantHelper 
{ 
public 
enum 
APIStatusCode !
{ 	
SUCCESS 
= 
$num 
, 
ERROR 
= 
$num 
, 
BAD_REQUEST 
= 
$num 
, 
UNAUTHORIZED 
= 
$num 
, 
PAGE_NOT_FOUND 
= 
$num  
,  !
ACCESS_DENIED 
= 
$num 
,  !
INTERNAL_SERVER_ERROR !
=" #
$num$ '
} 	
public 
enum 
APIState 
{ 	
[ 
Display 
( 
Name 
= 
$str %
)% &
]& '
SUCCESS 
, 
[ 
Display 
( 
Name 
= 
$str $
)$ %
]% &
FAILED 
} 	
public   
const   
string   3
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME   C
=  D E
$str  F T
;  T U
public!! 
const!! 
string!! 
PROJECT_NAME!! (
=!!) *
$str!!+ @
;!!@ A
public"" 
const"" 
string"" 
REPORT_EXTENSION"" ,
=""- .
$str""/ 5
;""5 6
public$$ 
static$$ 
string$$ 

TOKEN_PATH$$ '
=$$( )
$str$$* :
;$$: ;
public%% 
static%% 
string%% ,
 VALIDATE_CLIENT_USER_MAPPING_URL%% =
=%%> ?
$str%%@ o
;%%o p
public'' 
static'' 
string'' 
REPORT_DETAILS'' +
='', -
$str''. ?
;''? @
public(( 
static(( 
string(( 
REPORT_NAME(( (
=(() *
$str((+ 8
;((8 9
public)) 
static)) 
string)) 
REPORT_ENTITY)) *
=))+ ,
$str))- 5
;))5 6
public** 
static** 
string** 
TEMPLATE** %
=**& '
$str**( ;
;**; <
public++ 
static++ 
string++ 
TEMPLATE_DETAILS++ -
=++. /
$str++0 B
;++B C
public,, 
static,, 
string,, 
	COPY_FROM,, &
=,,' (
$str,,) ;
;,,; <
public-- 
static-- 
string-- 
COPY_FROM_DETAILS-- .
=--/ 0
$str--1 K
;--K L
public.. 
static.. 
string.. "
START_ACTIVITY_DETAILS.. 3
=..4 5
$str..6 ]
;..] ^
public// 
static// 
string// 
REQUESTED_PAGE// +
=//, -
$str//. F
;//F G
public00 
static00 
string00 
	REQUESTED00 &
=00' (
$str00) 4
;004 5
public33 
const33 
string33 

DRAFT_MODE33 &
=33' (
$str33) 0
;330 1
public44 
const44 
string44 
PUBLISH_MODE44 (
=44) *
$str44+ 4
;444 5
public55 
const55 
string55 
SAVE_AS_DRAFT55 )
=55* +
$str55, ;
;55; <
public66 
const66 
string66 
SAVE_AND_PUBLISH66 ,
=66- .
$str66/ ?
;66? @
public99 
const99 
string99  
REPORT_DATABASE_NAME99 0
=991 2
$str993 >
;99> ?
public:: 
const:: 
string:: 
PARA_REPORT_TITLE:: -
=::. /
$str::0 B
;::B C
public;; 
const;; 
string;; 
PARA_REPORT_VERSION;; /
=;;0 1
$str;;2 G
;;;G H
public<< 
const<< 
string<< (
Para_ImageFolderPathFor_ROHS<< 8
=<<9 :
$str<<; Y
;<<Y Z
public?? 
const?? 
string?? 
INVALID_PARAMETER?? -
=??. /
$str??0 C
;??C D
public@@ 
const@@ 
string@@ 
SOMTHING_WRONG@@ *
=@@+ ,
$str@@- =
;@@= >
publicAA 
constAA 
stringAA 
	NOT_FOUNDAA %
=AA& '
$strAA( 3
;AA3 4
publicBB 
constBB 
stringBB 
MUST_UNIQUE_GLOBALBB .
=BB/ 0
$strBB1 E
;BBE F
publicCC 
constCC 
stringCC $
ACTIVITY_ALREADY_STARTEDCC 4
=CC5 6
$strCC7 Q
;CCQ R
publicDD 
constDD 
stringDD 
CREATEDDD #
=DD$ %
$strDD& /
;DD/ 0
publicEE 
constEE 
stringEE 
UPDATEDEE #
=EE$ %
$strEE& /
;EE/ 0
publicFF 
constFF 
stringFF 
ALREADY_EXISTSFF *
=FF+ ,
$strFF- =
;FF= >
publicGG 
constGG 
stringGG 
POPUP_ACCESS_DENIEDGG /
=GG0 1
$strGG2 G
;GGG H
publicHH 
constHH 
stringHH !
DISCARD_DRAFT_CHANGESHH 1
=HH2 3
$strHH4 K
;HHK L
publicII 
constII 
stringII !
CONFIRM_STOP_ACTIVITYII 1
=II2 3
$strII4 K
;IIK L
publicJJ 
constJJ 
stringJJ "
CONFIRM_REPORT_VERSIONJJ 2
=JJ3 4
$strJJ5 M
;JJM N
publicKK 
constKK 
stringKK (
SUCCESSFULLY_DISCARD_CHANGESKK 8
=KK9 :
$strKK; Y
;KKY Z
publicLL 
constLL 
stringLL !
STOP_ACTIVITY_SUCCESSLL 1
=LL2 3
$strLL4 K
;LLK L
publicMM 
constMM 
stringMM "
SUCCESSFULLY_PUBLISHEDMM 2
=MM3 4
$strMM5 M
;MMM N
publicNN 
constNN 
stringNN &
SUCCESSFULLY_SAVE_AS_DRAFTNN 6
=NN7 8
$strNN9 U
;NNU V
publicQQ 
staticQQ 
stringQQ 
LOGOUT_CONFIRMATIONQQ 0
=QQ1 2
$str	QQ3 Ä
;
QQÄ Å
publicRR 
constRR 
stringRR &
MAY_YOUR_SESSION_ISEXPIREDRR 6
=RR7 8
$strRR9 W
;RRW X
publicSS 
constSS 
stringSS $
MONGODB_CONNECTION_ERRORSS 4
=SS5 6
$str	SS7 Å
;
SSÅ Ç
}UU 
}VV ã 
ND:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\MemoryCacheTicketStore.cs
	namespace		 	
FJT		
 
.		 
ReportDesigner		 
.		 
Helper		 #
{

 
public 

class "
MemoryCacheTicketStore '
:( )
ITicketStore* 6
{ 
private 
const 
string 
	KeyPrefix &
=' (
$str) <
;< =
private 
IMemoryCache 
_cache #
;# $
public "
MemoryCacheTicketStore %
(% &
)& '
{ 	
_cache 
= 
new 
MemoryCache $
($ %
new% (
MemoryCacheOptions) ;
(; <
)< =
)= >
;> ?
} 	
public 
async 
Task 
< 
string  
>  !

StoreAsync" ,
(, - 
AuthenticationTicket- A
ticketB H
)H I
{ 	
var 
guid 
= 
Guid 
. 
NewGuid #
(# $
)$ %
;% &
var 
key 
= 
	KeyPrefix 
+  !
guid" &
.& '
ToString' /
(/ 0
)0 1
;1 2
await 

RenewAsync 
( 
key  
,  !
ticket" (
)( )
;) *
return 
key 
; 
} 	
public 
Task 

RenewAsync 
( 
string %
key& )
,) * 
AuthenticationTicket+ ?
ticket@ F
)F G
{ 	
var 
options 
= 
new #
MemoryCacheEntryOptions 5
(5 6
)6 7
;7 8
var   

expiresUtc   
=   
ticket   #
.  # $

Properties  $ .
.  . /

ExpiresUtc  / 9
;  9 :
if!! 
(!! 

expiresUtc!! 
.!! 
HasValue!! #
)!!# $
{"" 
options## 
.## !
SetAbsoluteExpiration## -
(##- .

expiresUtc##. 8
.##8 9
Value##9 >
)##> ?
;##? @
}$$ 
options%% 
.%%  
SetSlidingExpiration%% (
(%%( )
TimeSpan%%) 1
.%%1 2
	FromHours%%2 ;
(%%; <
$num%%< =
)%%= >
)%%> ?
;%%? @
_cache'' 
.'' 
Set'' 
('' 
key'' 
,'' 
ticket'' "
,''" #
options''$ +
)''+ ,
;'', -
return)) 
Task)) 
.)) 

FromResult)) "
())" #
$num))# $
)))$ %
;))% &
}** 	
public,, 
Task,, 
<,,  
AuthenticationTicket,, (
>,,( )
RetrieveAsync,,* 7
(,,7 8
string,,8 >
key,,? B
),,B C
{-- 	 
AuthenticationTicket..  
ticket..! '
;..' (
_cache// 
.// 
TryGetValue// 
(// 
key// "
,//" #
out//$ '
ticket//( .
)//. /
;/// 0
return00 
Task00 
.00 

FromResult00 "
(00" #
ticket00# )
)00) *
;00* +
}11 	
public33 
Task33 
RemoveAsync33 
(33  
string33  &
key33' *
)33* +
{44 	
_cache55 
.55 
Remove55 
(55 
key55 
)55 
;55 
return66 
Task66 
.66 

FromResult66 "
(66" #
$num66# $
)66$ %
;66% &
}77 	
}88 
}99 ÿ	
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\ResponseModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Helper #
{ 
public 

class 
ResponseModel 
{		 
public 
bool 
	IsSuccess 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
Message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
object 
Model 
{ 
get !
;! "
set# &
;& '
}( )
public 
int 
	ListCount 
{ 
get "
;" #
set$ '
;' (
}) *
public"" 
int"" 
ActiveEmpCount"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
public$$ 
int$$ 

StatusCode$$ 
{$$ 
get$$  #
;$$# $
set$$% (
;$$( )
}$$* +
}%% 
}&& û
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\StaticMethods.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Helper #
{		 
public

 

static

 
class

 
StaticMethods

 %
{ 
public 
static 
string 
GetDisplayValue ,
(, -
this- 1
Enum2 6
instance7 ?
)? @
{ 	
var 
	fieldInfo 
= 
instance $
.$ %
GetType% ,
(, -
)- .
.. /
	GetMember/ 8
(8 9
instance9 A
.A B
ToStringB J
(J K
)K L
)L M
.M N
SingleN T
(T U
)U V
;V W
var !
descriptionAttributes %
=& '
	fieldInfo( 1
.1 2
GetCustomAttributes2 E
(E F
typeofF L
(L M
DisplayAttributeM ]
)] ^
,^ _
false` e
)e f
asg i
DisplayAttributej z
[z {
]{ |
;| }
if 
( !
descriptionAttributes %
==& (
null) -
)- .
return/ 5
instance6 >
.> ?
ToString? G
(G H
)H I
;I J
return 
( !
descriptionAttributes )
.) *
Length* 0
>1 2
$num3 4
)4 5
?6 7!
descriptionAttributes8 M
[M N
$numN O
]O P
.P Q
GetNameQ X
(X Y
)Y Z
:[ \
instance] e
.e f
ToStringf n
(n o
)o p
;p q
} 	
public 
static 
DateTime 
GetUtcDateTime -
(- .
). /
{ 	
return 
DateTime 
. 
UtcNow !
;! "
} 	
} 
} ¸
FD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ErrorViewModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
ErrorViewModel 
{ 
public 
int 
? 

StatusCode 
{  
get! $
;$ %
set& )
;) *
}+ ,
public		 
string		 
Message		 
{		 
get		  #
;		# $
set		% (
;		( )
}		* +
}

 
} ÿ
HD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\FilterParameters.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
} ˘
HD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ReportByteDataVM.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
ReportByteDataVM !
{		 
public

 
byte

 
[

 
]

 
ReportByteData

 $
{

% &
get

' *
;

* +
set

, /
;

/ 0
}

1 2
} 
} ‰
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ReportIdModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
ReportIdModel 
{		 
public

 
int

 
Id

 
{

 
get

 
;

 
set

  
;

  !
}

" #
public 
string 
fileName 
{  
get! $
;$ %
set& )
;) *
}+ ,
} 
} …
FD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ReportmasterVM.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
ReportmasterVM 
{ 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
string 

reportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
reportTitle !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
fileName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
reportCreateType #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
int 
? 

templateId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public"" 
int"" 
?"" 
refReportId"" 
{""  !
get""" %
;""% &
set""' *
;""* +
}"", -
public$$ 
bool$$ 
isEndUserReport$$ #
{$$$ %
get$$& )
;$$) *
set$$+ .
;$$. /
}$$0 1
public&& 
string&&  
reportGenerationType&& *
{&&+ ,
get&&- 0
;&&0 1
set&&2 5
;&&5 6
}&&7 8
public)) 
int)) 
?)) 
entityId)) 
{)) 
get)) "
;))" #
set))$ '
;))' (
}))) *
public,, 
int,, 
?,, 
gencCategoryID,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
public// 
int// 

reportType// 
{// 
get//  #
;//# $
set//% (
;//( )
}//* +
public22 
int22 
userId22 
{22 
get22 
;22  
set22! $
;22$ %
}22& '
public55 
int55 

userRoleId55 
{55 
get55  #
;55# $
set55% (
;55( )
}55* +
public77 
string77 
additionalNotes77 %
{77& '
get77( +
;77+ ,
set77- 0
;770 1
}772 3
public99 
bool99 
isDefaultReport99 #
{99$ %
get99& )
;99) *
set99+ .
;99. /
}990 1
}:: 
};; ‚$
PD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\RequestFilterParameterVM.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public		 

class		 $
RequestFilterParameterVM		 )
{

 
public 
int 
? 

customerID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
? 
partID 
{ 
get  
;  !
set" %
;% &
}' (
public 
int 
? 

employeeID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
? 

supplierID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
? 
	mfgCodeID 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
? 
assyID 
{ 
get  
;  !
set" %
;% &
}' (
public 
int 
? 
mountingTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
int 
? 
functionalTypeID $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
int 
? 
partStatusID  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
int 
? 
workorderID 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
? 
operationID 
{  !
get" %
;% &
set' *
;* +
}, -
public 
bool 
? 
withAlternateParts '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
int 
? 
radioButtonFilter %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
DateTime 
? 
fromDate !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
toDate 
{  !
get" %
;% &
set' *
;* +
}, -
public 
DateTime 
? 
fromTime !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
toTime 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
? 
packingSlipId !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public   
string   
	deletedBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public!! 
int!! 
createByRoleId!! !
{!!" #
get!!$ '
;!!' (
set!!) ,
;!!, -
}!!. /
public"" 
int"" 
?"" 
updateByRoleId"" "
{""# $
get""% (
;""( )
set""* -
;""- .
}""/ 0
public## 
int## 
?## 
deleteByRoleId## "
{### $
get##% (
;##( )
set##* -
;##- .
}##/ 0
public$$ 
string$$ 

reportName$$  
{$$! "
get$$# &
;$$& '
set$$( +
;$$+ ,
}$$- .
}%% 
}&& ∞
GD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\SaveReportModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
SaveReportModel  
{		 
public

 
string

 

ReportGUID

  
{

! "
get

# &
;

& '
set

( +
;

+ ,
}

- .
public 
string 

ReportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
SaveReportMode $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
byte 
[ 
] 
ReportByteData $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
string 
PublishVersion $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
string 
ReportStatus "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
Error 
{ 
get !
;! "
set# &
;& '
}( )
} 
} µ
LD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MongoDbModel\DynamicMessage.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MongoDbModel )
{		 
public

 

class

 
DynamicMessage

 
{ 
[ 	
BsonId	 
] 
[ 	
BsonRepresentation	 
( 
BsonType $
.$ %
ObjectId% -
)- .
]. /
public 
string 
_id 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 

messageKey  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
category 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
messageType !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
messageCode !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
createdByName #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
DateTime 
createdDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
modifiedByName $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
DateTime 
modifiedDate $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
versionNumber  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
	developer 
{  !
get" %
;% &
set' *
;* +
}, -
public 
object 
previousVersion %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} Õ 
DD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\entity.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{ 
public		 

class		 
entity		 
{

 
public 
entity 
( 
) 
{ 	
reportmaster 
= 
new 
HashSet &
<& '
reportmaster' 3
>3 4
(4 5
)5 6
;6 7
} 	
[ 	
Key	 
] 
public 
int 
entityID 
{ 
get !
;! "
set# &
;& '
}( )
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

entityName  
{! "
get# &
;& '
set( +
;+ ,
}- .
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
remark 
{ 
get "
;" #
set$ '
;' (
}) *
public 
bool 
isActive 
{ 
get "
;" #
set$ '
;' (
}) *
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
	updatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public!! 
DateTime!! 
?!! 
	deletedAt!! "
{!!# $
get!!% (
;!!( )
set!!* -
;!!- .
}!!/ 0
[## 	
StringLength##	 
(## 
$num## 
)## 
]## 
public$$ 
string$$ 
	createdBy$$ 
{$$  !
get$$" %
;$$% &
set$$' *
;$$* +
}$$, -
[&& 	
StringLength&&	 
(&& 
$num&& 
)&& 
]&& 
public'' 
string'' 
	updatedBy'' 
{''  !
get''" %
;''% &
set''' *
;''* +
}'', -
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	deletedBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
public,, 
bool,, 
systemGenerated,, #
{,,$ %
get,,& )
;,,) *
set,,+ .
;,,. /
},,0 1
public.. 
int.. 
?.. 

columnView.. 
{..  
get..! $
;..$ %
set..& )
;..) *
}..+ ,
public00 
int00 
?00 
entityStatus00  
{00! "
get00# &
;00& '
set00( +
;00+ ,
}00- .
public22 
int22 
?22 
createByRoleId22 "
{22# $
get22% (
;22( )
set22* -
;22- .
}22/ 0
public44 
int44 
?44 
updateByRoleId44 "
{44# $
get44% (
;44( )
set44* -
;44- .
}44/ 0
public66 
int66 
?66 
deleteByRoleId66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
public88 
virtual88 
ICollection88 "
<88" #
reportmaster88# /
>88/ 0
reportmaster881 =
{88> ?
get88@ C
;88C D
set88E H
;88H I
}88J K
}99 
}:: © 
TD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\FixedEntityDataelement.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{		 
[

 
Table

 

(


 
$str

 %
)

% &
]

& '
public 

class "
FixedEntityDataelement '
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
reportParamName %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
dbColumnName "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
displayName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
bool 
isHiddenParameter %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[   	
StringLength  	 
(   
$num   
)   
]   
public!! 
string!! 
type!! 
{!! 
get!!  
;!!  !
set!!" %
;!!% &
}!!' (
public## 
int## 
?## 
dataSourceId##  
{##! "
get### &
;##& '
set##( +
;##+ ,
}##- .
public%% 
string%% 
options%% 
{%% 
get%%  #
;%%# $
set%%% (
;%%( )
}%%* +
public'' 
bool'' 
	isDeleted'' 
{'' 
get''  #
;''# $
set''% (
;''( )
}''* +
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	createdBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
[,, 	
StringLength,,	 
(,, 
$num,, 
),, 
],, 
public-- 
string-- 
	updatedBy-- 
{--  !
get--" %
;--% &
set--' *
;--* +
}--, -
[// 	
StringLength//	 
(// 
$num// 
)// 
]// 
public00 
string00 
	deletedBy00 
{00  !
get00" %
;00% &
set00' *
;00* +
}00, -
public22 
int22 
?22 
createByRoleId22 "
{22# $
get22% (
;22( )
set22* -
;22- .
}22/ 0
public44 
int44 
?44 
updateByRoleId44 "
{44# $
get44% (
;44( )
set44* -
;44- .
}44/ 0
public66 
int66 
?66 
deleteByRoleId66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
public88 
DateTime88 
	createdAt88 !
{88" #
get88$ '
;88' (
set88) ,
;88, -
}88. /
public:: 
DateTime:: 
?:: 
	deletedAt:: "
{::# $
get::% (
;::( )
set::* -
;::- .
}::/ 0
public<< 
DateTime<< 
?<< 
	updatedAt<< "
{<<# $
get<<% (
;<<( )
set<<* -
;<<- .
}<</ 0
}?? 
}@@ π
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\FJTSqlDBContext.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{ 
public		 

class		 
FJTSqlDBContext		  
:		! "
	DbContext		# ,
{

 
public 
FJTSqlDBContext 
( 
DbContextOptions /
</ 0
FJTSqlDBContext0 ?
>? @
optionsA H
)H I
: 
base 
( 
options 
) 
{ 	
} 	
public 
virtual 
DbSet 
< 
entity #
># $
entity% +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
public 
virtual 
DbSet 
< 
genericcategory ,
>, -
genericcategory. =
{> ?
get@ C
;C D
setE H
;H I
}J K
public 
virtual 
DbSet 
< 
reportmaster )
>) *
reportmaster+ 7
{8 9
get: =
;= >
set? B
;B C
}D E
public 
virtual 
DbSet 
< ,
 report_parameter_setting_mapping =
>= >,
 report_parameter_setting_mapping? _
{` a
getb e
;e f
setg j
;j k
}l m
public 
virtual 
DbSet 
< 
report_change_logs /
>/ 0
report_change_logs1 C
{D E
getF I
;I J
setK N
;N O
}P Q
public 
virtual 
DbSet 
< 
users "
>" #
users$ )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
virtual 
DbSet 
< !
reportviewerparameter 2
>2 3!
reportviewerparameter4 I
{J K
getL O
;O P
setQ T
;T U
}V W
public 
virtual 
DbSet 
< !
reportmasterparameter 2
>2 3!
reportmasterparameter4 I
{J K
getL O
;O P
setQ T
;T U
}V W
public 
virtual 
DbSet 
< "
FixedEntityDataelement 3
>3 4#
FixedEntityDataelements5 L
{M N
getO R
;R S
setT W
;W X
}Y Z
public 
virtual 
DbSet 
< 
Systemconfigrations 0
>0 1
Systemconfigrations2 E
{F G
getH K
;K L
setM P
;P Q
}R S
} 
} °*
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\genericcategory.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{ 
public		 

class		 
genericcategory		  
{

 
public 
genericcategory 
( 
)  
{ 	
reportmaster 
= 
new 
HashSet &
<& '
reportmaster' 3
>3 4
(4 5
)5 6
;6 7
} 	
[ 	
Key	 
] 
public 
int 
gencCategoryID !
{" #
get$ '
;' (
set) ,
;, -
}. /
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
gencCategoryName &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
gencCategoryCode &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
categoryType "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
decimal 
displayOrder #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
?  
parentGencCategoryID (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
bool 
isActive 
{ 
get "
;" #
set$ '
;' (
}) *
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
	updatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
DateTime 
? 
	deletedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	createdBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
[!! 	
StringLength!!	 
(!! 
$num!! 
)!! 
]!! 
public"" 
string"" 
	updatedBy"" 
{""  !
get""" %
;""% &
set""' *
;""* +
}"", -
[## 	
StringLength##	 
(## 
$num## 
)## 
]## 
public$$ 
string$$ 
	deletedBy$$ 
{$$  !
get$$" %
;$$% &
set$$' *
;$$* +
}$$, -
public%% 
bool%% 
systemGenerated%% #
{%%$ %
get%%& )
;%%) *
set%%+ .
;%%. /
}%%0 1
[&& 	
StringLength&&	 
(&& 
$num&& 
)&& 
]&& 
public'' 
string'' 
	colorCode'' 
{''  !
get''" %
;''% &
set''' *
;''* +
}'', -
public(( 
int(( 
?(( 
	termsDays(( 
{(( 
get((  #
;((# $
set((% (
;((( )
}((* +
public)) 
int)) 
?)) 
createByRoleId)) "
{))# $
get))% (
;))( )
set))* -
;))- .
}))/ 0
public** 
int** 
?** 
updateByRoleId** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
public++ 
int++ 
?++ 
deleteByRoleId++ "
{++# $
get++% (
;++( )
set++* -
;++- .
}++/ 0
public,, 
int,, 
?,, 
	carrierID,, 
{,, 
get,,  #
;,,# $
set,,% (
;,,( )
},,* +
public-- 
string-- 
description-- !
{--" #
get--$ '
;--' (
set--) ,
;--, -
}--. /
public.. 
bool.. 
?.. 
isEOM.. 
{.. 
get..  
;..  !
set.." %
;..% &
}..' (
public// 
virtual// 
ICollection// "
<//" #
reportmaster//# /
>/// 0
reportmaster//1 =
{//> ?
get//@ C
;//C D
set//E H
;//H I
}//J K
}00 
}11 Ωj
JD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\reportmaster.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{		 
public

 

class

 
reportmaster

 
{ 
public 
reportmaster 
( 
) 
{ 	"
reportmasterparameters "
=# $
new% (
HashSet) 0
<0 1!
reportmasterparameter1 F
>F G
(G H
)H I
;I J
} 	
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

reportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
rdlcReportFileName (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
reportTitle !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
? 

customerID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public!! 
int!! 
?!! 
partID!! 
{!! 
get!!  
;!!  !
set!!" %
;!!% &
}!!' (
public## 
int## 
?## 
	companyID## 
{## 
get##  #
;### $
set##% (
;##( )
}##* +
public%% 
int%% 
?%% 
fromDate%% 
{%% 
get%% "
;%%" #
set%%$ '
;%%' (
}%%) *
public'' 
int'' 
?'' 
toDate'' 
{'' 
get''  
;''  !
set''" %
;''% &
}''' (
public)) 
string)) 
logicalExpression)) '
{))( )
get))* -
;))- .
set))/ 2
;))2 3
}))4 5
public++ 
bool++ 
	isDeleted++ 
{++ 
get++  #
;++# $
set++% (
;++( )
}++* +
public-- 
DateTime-- 
	createdAt-- !
{--" #
get--$ '
;--' (
set--) ,
;--, -
}--. /
[// 	
StringLength//	 
(// 
$num// 
)// 
]// 
public00 
string00 
	createdBy00 
{00  !
get00" %
;00% &
set00' *
;00* +
}00, -
public22 
DateTime22 
?22 
	updatedAt22 "
{22# $
get22% (
;22( )
set22* -
;22- .
}22/ 0
[44 	
StringLength44	 
(44 
$num44 
)44 
]44 
public55 
string55 
	updatedBy55 
{55  !
get55" %
;55% &
set55' *
;55* +
}55, -
public77 
DateTime77 
?77 
	deletedAt77 "
{77# $
get77% (
;77( )
set77* -
;77- .
}77/ 0
[99 	
StringLength99	 
(99 
$num99 
)99 
]99 
public:: 
string:: 
	deletedBy:: 
{::  !
get::" %
;::% &
set::' *
;::* +
}::, -
public<< 
bool<< 
withAlternateParts<< &
{<<' (
get<<) ,
;<<, -
set<<. 1
;<<1 2
}<<3 4
public>> 
int>> 
?>> 
customerSelectType>> &
{>>' (
get>>) ,
;>>, -
set>>. 1
;>>1 2
}>>3 4
public@@ 
int@@ 
?@@ 
partSelectType@@ "
{@@# $
get@@% (
;@@( )
set@@* -
;@@- .
}@@/ 0
publicBB 
intBB 
?BB 

employeeIDBB 
{BB  
getBB! $
;BB$ %
setBB& )
;BB) *
}BB+ ,
publicDD 
intDD 
?DD 
employeeSelectTypeDD &
{DD' (
getDD) ,
;DD, -
setDD. 1
;DD1 2
}DD3 4
publicFF 
intFF 
?FF 

supplierIDFF 
{FF  
getFF! $
;FF$ %
setFF& )
;FF) *
}FF+ ,
publicHH 
intHH 
?HH 
supplierSelectTypeHH &
{HH' (
getHH) ,
;HH, -
setHH. 1
;HH1 2
}HH3 4
publicJJ 
intJJ 
?JJ 
	mfgCodeIDJJ 
{JJ 
getJJ  #
;JJ# $
setJJ% (
;JJ( )
}JJ* +
publicLL 
intLL 
?LL 
mfgCodeSelectTypeLL %
{LL& '
getLL( +
;LL+ ,
setLL- 0
;LL0 1
}LL2 3
publicNN 
intNN 
?NN 
assyIDNN 
{NN 
getNN  
;NN  !
setNN" %
;NN% &
}NN' (
publicPP 
intPP 
?PP 
assySelectTypePP "
{PP# $
getPP% (
;PP( )
setPP* -
;PP- .
}PP/ 0
publicRR 
intRR 
?RR 
mountingTypeIDRR "
{RR# $
getRR% (
;RR( )
setRR* -
;RR- .
}RR/ 0
publicTT 
intTT 
?TT "
mountingTypeSelectTypeTT *
{TT+ ,
getTT- 0
;TT0 1
setTT2 5
;TT5 6
}TT7 8
publicVV 
intVV 
?VV 
functionalTypeIDVV $
{VV% &
getVV' *
;VV* +
setVV, /
;VV/ 0
}VV1 2
publicXX 
intXX 
?XX $
functionalTypeSelectTypeXX ,
{XX- .
getXX/ 2
;XX2 3
setXX4 7
;XX7 8
}XX9 :
publicZZ 
intZZ 
?ZZ 
partStatusIDZZ  
{ZZ! "
getZZ# &
;ZZ& '
setZZ( +
;ZZ+ ,
}ZZ- .
public\\ 
int\\ 
?\\  
partStatusSelectType\\ (
{\\) *
get\\+ .
;\\. /
set\\0 3
;\\3 4
}\\5 6
public^^ 
int^^ 
?^^ 
workorderID^^ 
{^^  !
get^^" %
;^^% &
set^^' *
;^^* +
}^^, -
public`` 
int`` 
?`` 
workorderSelectType`` '
{``( )
get``* -
;``- .
set``/ 2
;``2 3
}``4 5
publicbb 
intbb 
?bb 
operationIDbb 
{bb  !
getbb" %
;bb% &
setbb' *
;bb* +
}bb, -
publicdd 
intdd 
?dd 
operationSelectTypedd '
{dd( )
getdd* -
;dd- .
setdd/ 2
;dd2 3
}dd4 5
publicff 
intff 
?ff 
reportCategoryIdff $
{ff% &
getff' *
;ff* +
setff, /
;ff/ 0
}ff1 2
publichh 
boolhh 
?hh 
reportViewTypehh #
{hh$ %
gethh& )
;hh) *
sethh+ .
;hh. /
}hh0 1
[jj 	
StringLengthjj	 
(jj 
$numjj 
)jj 
]jj 
publickk 
stringkk 
	reportAPIkk 
{kk  !
getkk" %
;kk% &
setkk' *
;kk* +
}kk, -
publicmm 
boolmm 
?mm 
isExcelmm 
{mm 
getmm "
;mm" #
setmm$ '
;mm' (
}mm) *
publicoo 
intoo 
?oo 
createByRoleIdoo "
{oo# $
getoo% (
;oo( )
setoo* -
;oo- .
}oo/ 0
publicqq 
intqq 
?qq 
updateByRoleIdqq "
{qq# $
getqq% (
;qq( )
setqq* -
;qq- .
}qq/ 0
publicss 
intss 
?ss 
deleteByRoleIdss "
{ss# $
getss% (
;ss( )
setss* -
;ss- .
}ss/ 0
publicuu 
intuu 
?uu 
emailTempleteuu !
{uu" #
getuu$ '
;uu' (
setuu) ,
;uu, -
}uu. /
publicww 
intww 
?ww 
fromTimeww 
{ww 
getww "
;ww" #
setww$ '
;ww' (
}ww) *
publicyy 
intyy 
?yy 
toTimeyy 
{yy 
getyy  
;yy  !
setyy" %
;yy% &
}yy' (
[{{ 	
StringLength{{	 
({{ 
$num{{ 
){{ 
]{{ 
public|| 
string|| 
fileName|| 
{||  
get||! $
;||$ %
set||& )
;||) *
}||+ ,
public~~ 
bool~~ 
?~~ 
isEndUserReport~~ $
{~~% &
get~~' *
;~~* +
set~~, /
;~~/ 0
}~~1 2
[
ÅÅ 	
StringLength
ÅÅ	 
(
ÅÅ 
$num
ÅÅ 
)
ÅÅ 
]
ÅÅ 
public
ÇÇ 
string
ÇÇ 
draftFileName
ÇÇ #
{
ÇÇ$ %
get
ÇÇ& )
;
ÇÇ) *
set
ÇÇ+ .
;
ÇÇ. /
}
ÇÇ0 1
public
ÑÑ 
bool
ÑÑ 
radioButtonFilter
ÑÑ %
{
ÑÑ& '
get
ÑÑ( +
;
ÑÑ+ ,
set
ÑÑ- 0
;
ÑÑ0 1
}
ÑÑ2 3
public
ÜÜ 
string
ÜÜ 
additionalNotes
ÜÜ %
{
ÜÜ& '
get
ÜÜ( +
;
ÜÜ+ ,
set
ÜÜ- 0
;
ÜÜ0 1
}
ÜÜ2 3
public
àà 
bool
àà 
isCSVReport
àà 
{
àà  !
get
àà" %
;
àà% &
set
àà' *
;
àà* +
}
àà, -
public
ää 
string
ää 
csvReportAPI
ää "
{
ää# $
get
ää% (
;
ää( )
set
ää* -
;
ää- .
}
ää/ 0
public
åå 
int
åå 
?
åå 
refReportId
åå 
{
åå  !
get
åå" %
;
åå% &
set
åå' *
;
åå* +
}
åå, -
[
éé 	
StringLength
éé	 
(
éé 
$num
éé 
)
éé 
]
éé 
public
èè 
string
èè 
status
èè 
{
èè 
get
èè "
;
èè" #
set
èè$ '
;
èè' (
}
èè) *
public
ëë 
int
ëë 
?
ëë 
entityId
ëë 
{
ëë 
get
ëë "
;
ëë" #
set
ëë$ '
;
ëë' (
}
ëë) *
public
ìì 
int
ìì 
?
ìì 
	editingBy
ìì 
{
ìì 
get
ìì  #
;
ìì# $
set
ìì% (
;
ìì( )
}
ìì* +
public
ïï 
DateTime
ïï 
?
ïï  
startDesigningDate
ïï +
{
ïï, -
get
ïï. 1
;
ïï1 2
set
ïï3 6
;
ïï6 7
}
ïï8 9
public
óó 
string
óó "
reportGenerationType
óó *
{
óó+ ,
get
óó- 0
;
óó0 1
set
óó2 5
;
óó5 6
}
óó7 8
[
ôô 	
StringLength
ôô	 
(
ôô 
$num
ôô 
)
ôô 
]
ôô 
public
öö 
string
öö 
reportVersion
öö #
{
öö$ %
get
öö& )
;
öö) *
set
öö+ .
;
öö. /
}
öö0 1
public
úú 
bool
úú 
isDefaultReport
úú #
{
úú$ %
get
úú& )
;
úú) *
set
úú+ .
;
úú. /
}
úú0 1
[
ûû 	

ForeignKey
ûû	 
(
ûû 
$str
ûû 
)
ûû 
]
ûû  
public
üü 
virtual
üü 
entity
üü 
entity
üü $
{
üü% &
get
üü' *
;
üü* +
set
üü, /
;
üü/ 0
}
üü1 2
[
°° 	

ForeignKey
°°	 
(
°° 
$str
°° &
)
°°& '
]
°°' (
public
¢¢ 
virtual
¢¢ 
genericcategory
¢¢ &
genericcategory
¢¢' 6
{
¢¢7 8
get
¢¢9 <
;
¢¢< =
set
¢¢> A
;
¢¢A B
}
¢¢C D
public
¶¶ 
virtual
¶¶ 
ICollection
¶¶ "
<
¶¶" ##
reportmasterparameter
¶¶# 8
>
¶¶8 9$
reportmasterparameters
¶¶: P
{
¶¶Q R
get
¶¶S V
;
¶¶V W
set
¶¶X [
;
¶¶[ \
}
¶¶] ^
}
ßß 
}®® Ù
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\reportmasterparameter.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{		 
public

 

class

 !
reportmasterparameter

 &
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
int 
reportId 
{ 
get !
;! "
set# &
;& '
}( )
public 
int 
parmeterMappingid $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 

isRequired 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	deletedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public   
DateTime   
	createdAt   !
{  " #
get  $ '
;  ' (
set  ) ,
;  , -
}  . /
public"" 
DateTime"" 
?"" 
	updatedAt"" "
{""# $
get""% (
;""( )
set""* -
;""- .
}""/ 0
public$$ 
DateTime$$ 
?$$ 
	deletedAt$$ "
{$$# $
get$$% (
;$$( )
set$$* -
;$$- .
}$$/ 0
public&& 
int&& 
createByRoleId&& !
{&&" #
get&&$ '
;&&' (
set&&) ,
;&&, -
}&&. /
public(( 
int(( 
?(( 
updateByRoleId(( "
{((# $
get((% (
;((( )
set((* -
;((- .
}((/ 0
public** 
int** 
?** 
deleteByRoleId** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
[,, 	

ForeignKey,,	 
(,, 
$str,, 
),, 
],,  
public-- 
virtual-- 
reportmaster-- #
reportmaster--$ 0
{--1 2
get--3 6
;--6 7
set--8 ;
;--; <
}--= >
[// 	

ForeignKey//	 
(// 
$str// '
)//' (
]//( )
public00 
virtual00 ,
 report_parameter_setting_mapping00 7,
 Report_Parameter_Setting_Mapping008 X
{00Y Z
get00[ ^
;00^ _
set00` c
;00c d
}00e f
}11 
}22 ¢
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\reportviewerparameter.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{		 
public

 

class

 !
reportviewerparameter

 &
{ 
[ 	
Key	 
] 
public 
Guid 
parameterGUID !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
reportId 
{ 
get !
;! "
set# &
;& '
}( )
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

reportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
parameterValues %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	deletedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public!! 
DateTime!! 
	createdAt!! !
{!!" #
get!!$ '
;!!' (
set!!) ,
;!!, -
}!!. /
public## 
DateTime## 
?## 
	updatedAt## "
{### $
get##% (
;##( )
set##* -
;##- .
}##/ 0
public%% 
DateTime%% 
?%% 
	deletedAt%% "
{%%# $
get%%% (
;%%( )
set%%* -
;%%- .
}%%/ 0
public'' 
int'' 
createByRoleId'' !
{''" #
get''$ '
;''' (
set'') ,
;'', -
}''. /
public)) 
int)) 
?)) 
updateByRoleId)) "
{))# $
get))% (
;))( )
set))* -
;))- .
}))/ 0
public++ 
int++ 
?++ 
deleteByRoleId++ "
{++# $
get++% (
;++( )
set++* -
;++- .
}++/ 0
[-- 	

ForeignKey--	 
(-- 
$str-- 
)-- 
]--  
public.. 
virtual.. 
reportmaster.. #
reportmaster..$ 0
{..1 2
get..3 6
;..6 7
set..8 ;
;..; <
}..= >
}// 
}00 Ò
PD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\report_change_logs.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{		 
public

 

class

 
report_change_logs

 #
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
int 
reportId 
{ 
get !
;! "
set# &
;& '
}( )
public 
DateTime 
startActivityDate )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
DateTime 
? 
endActivityDate (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
int 
activityStartBy "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	deletedBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public"" 
DateTime"" 
	createdAt"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
public$$ 
DateTime$$ 
?$$ 
	updatedAt$$ "
{$$# $
get$$% (
;$$( )
set$$* -
;$$- .
}$$/ 0
public&& 
DateTime&& 
?&& 
	deletedAt&& "
{&&# $
get&&% (
;&&( )
set&&* -
;&&- .
}&&/ 0
public(( 
int(( 
?(( 
createByRoleId(( "
{((# $
get((% (
;((( )
set((* -
;((- .
}((/ 0
public** 
int** 
?** 
updateByRoleId** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
public,, 
int,, 
?,, 
deleteByRoleId,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
[.. 	

ForeignKey..	 
(.. 
$str.. 
).. 
]..  
public// 
virtual// 
reportmaster// #
reportmaster//$ 0
{//1 2
get//3 6
;//6 7
set//8 ;
;//; <
}//= >
}00 
}11 ◊&
^D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\report_parameter_setting_mapping.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{		 
public

 

class

 ,
 report_parameter_setting_mapping

 1
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
reportParamName %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
dbColumnName "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
displayName !
{" #
get$ '
;' (
set) ,
;, -
}. /
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
pageRouteState $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 
isHiddenParameter %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
type 
{ 
get  
;  !
set" %
;% &
}' (
public   
int   
?   
dataSourceId    
{  ! "
get  # &
;  & '
set  ( +
;  + ,
}  - .
public"" 
string"" 
options"" 
{"" 
get""  #
;""# $
set""% (
;""( )
}""* +
public$$ 
bool$$ 
	isDeleted$$ 
{$$ 
get$$  #
;$$# $
set$$% (
;$$( )
}$$* +
public&& 
bool&& 
	isDisplay&& 
{&& 
get&&  #
;&&# $
set&&% (
;&&( )
}&&* +
public(( 
decimal(( 
displayOrder(( #
{(($ %
get((& )
;(() *
set((+ .
;((. /
}((0 1
[** 	
StringLength**	 
(** 
$num** 
)** 
]** 
public++ 
string++ 
	createdBy++ 
{++  !
get++" %
;++% &
set++' *
;++* +
}++, -
[-- 	
StringLength--	 
(-- 
$num-- 
)-- 
]-- 
public.. 
string.. 
	updatedBy.. 
{..  !
get.." %
;..% &
set..' *
;..* +
}.., -
[00 	
StringLength00	 
(00 
$num00 
)00 
]00 
public11 
string11 
	deletedBy11 
{11  !
get11" %
;11% &
set11' *
;11* +
}11, -
public33 
int33 
?33 
createByRoleId33 "
{33# $
get33% (
;33( )
set33* -
;33- .
}33/ 0
public55 
int55 
?55 
updateByRoleId55 "
{55# $
get55% (
;55( )
set55* -
;55- .
}55/ 0
public77 
int77 
?77 
deleteByRoleId77 "
{77# $
get77% (
;77( )
set77* -
;77- .
}77/ 0
public99 
DateTime99 
	createdAt99 !
{99" #
get99$ '
;99' (
set99) ,
;99, -
}99. /
public;; 
DateTime;; 
?;; 
	deletedAt;; "
{;;# $
get;;% (
;;;( )
set;;* -
;;;- .
};;/ 0
public== 
DateTime== 
?== 
	updatedAt== "
{==# $
get==% (
;==( )
set==* -
;==- .
}==/ 0
[?? 	

ForeignKey??	 
(?? 
$str?? "
)??" #
]??# $
public@@ 
virtual@@ "
FixedEntityDataelement@@ -"
FixedEntityDataelement@@. D
{@@E F
get@@G J
;@@J K
set@@L O
;@@O P
}@@Q R
}AA 
}BB ¶"
QD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\Systemconfigrations.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{		 
[

 
Table

 

(


 
$str

  
)

  !
]

! "
public 

class 
Systemconfigrations $
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
key 
{ 
get 
;  
set! $
;$ %
}& '
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
values 
{ 
get "
;" #
set$ '
;' (
}) *
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
clusterName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
bool 
? 
isEncrypted  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
bool 
? 
isActive 
{ 
get  #
;# $
set% (
;( )
}* +
public 
bool 
? 
	isDeleted 
{  
get! $
;$ %
set& )
;) *
}+ ,
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	createdBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public"" 
DateTime"" 
	createdAt"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
[$$ 	
StringLength$$	 
($$ 
$num$$ 
)$$ 
]$$ 
public%% 
string%% 
	updatedBy%% 
{%%  !
get%%" %
;%%% &
set%%' *
;%%* +
}%%, -
public'' 
DateTime'' 
	updatedAt'' !
{''" #
get''$ '
;''' (
set'') ,
;'', -
}''. /
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	deletedBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
public,, 
DateTime,, 
?,, 
	deletedAt,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
public.. 
bool.. 

isEditable.. 
{..  
get..! $
;..$ %
set..& )
;..) *
}..+ ,
[00 	
StringLength00	 
(00 
$num00 
)00 
]00 
public11 
string11 
description11 !
{11" #
get11$ '
;11' (
set11) ,
;11, -
}11. /
[33 	
StringLength33	 
(33 
$num33 
)33 
]33 
public44 
string44 
displayName44 !
{44" #
get44$ '
;44' (
set44) ,
;44, -
}44. /
public66 
int66 
?66 
createByRoleId66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
public88 
int88 
?88 
updateByRoleId88 "
{88# $
get88% (
;88( )
set88* -
;88- .
}88/ 0
public:: 
int:: 
?:: 
deleteByRoleId:: "
{::# $
get::% (
;::( )
set::* -
;::- .
}::/ 0
};; 
}<< »(
CD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\users.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{ 
public		 

class		 
users		 
{

 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
username 
{  
get! $
;$ %
set& )
;) *
}+ ,
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
passwordDigest $
{% &
get' *
;* +
set, /
;/ 0
}1 2
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
emailAddress "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	firstName 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
lastName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
	updatedAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public!! 
DateTime!! 
?!! 
	deletedAt!! "
{!!# $
get!!% (
;!!( )
set!!* -
;!!- .
}!!/ 0
[## 	
StringLength##	 
(## 
$num## 
)## 
]## 
public$$ 
string$$ 
	createdBy$$ 
{$$  !
get$$" %
;$$% &
set$$' *
;$$* +
}$$, -
[&& 	
StringLength&&	 
(&& 
$num&& 
)&& 
]&& 
public'' 
string'' 
	updatedBy'' 
{''  !
get''" %
;''% &
set''' *
;''* +
}'', -
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	deletedBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
public,, 
bool,, 
?,, 
	isDeleted,, 
{,,  
get,,! $
;,,$ %
set,,& )
;,,) *
},,+ ,
[.. 	
StringLength..	 
(.. 
$num.. 
).. 
].. 
public// 
string// 
onlineStatus// "
{//# $
get//% (
;//( )
set//* -
;//- .
}/// 0
public11 
int11 
?11 

employeeID11 
{11  
get11! $
;11$ %
set11& )
;11) *
}11+ ,
public33 
Guid33 
?33 
forGotPasswordToken33 (
{33) *
get33+ .
;33. /
set330 3
;333 4
}335 6
public55 
DateTime55 
?55 #
tokenGenerationDateTime55 0
{551 2
get553 6
;556 7
set558 ;
;55; <
}55= >
public77 
int77 
?77 
	printerID77 
{77 
get77  #
;77# $
set77% (
;77( )
}77* +
public99 
int99 
?99 
defaultLoginRoleID99 &
{99' (
get99) ,
;99, -
set99. 1
;991 2
}993 4
public;; 
int;; 
?;; 
createByRoleId;; "
{;;# $
get;;% (
;;;( )
set;;* -
;;;- .
};;/ 0
public== 
int== 
?== 
updateByRoleId== "
{==# $
get==% (
;==( )
set==* -
;==- .
}==/ 0
public?? 
int?? 
??? 
deleteByRoleId?? "
{??# $
get??% (
;??( )
set??* -
;??- .
}??/ 0
[AA 	
StringLengthAA	 
(AA 
$numAA 
)AA 
]AA 
publicBB 
stringBB 
IdentityUserIdBB $
{BB% &
getBB' *
;BB* +
setBB, /
;BB/ 0
}BB1 2
}CC 
}DD ÿ
8D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Program.cs
	namespace 	
FJT
 
. 
ReportDesigner 
{ 
public 

class 
Program 
{ 
public 
static 
void 
Main 
(  
string  &
[& '
]' (
args) -
)- .
{ 	
var 
config 
= 
new  
ConfigurationBuilder 1
(1 2
)2 3
. 
AddJsonFile 
( 
$str .
). /
. 
Build 
( 
) 
; 
Log 
. 
Logger 
= 
new 
LoggerConfiguration 0
(0 1
)1 2
. 
ReadFrom 
. 
Configuration *
(* +
config+ 1
)1 2
. 
CreateLogger  
(  !
)! "
;" #
try 
{ 
Log 
. 
Information 
(  
$str  7
)7 8
;8 9
CreateHostBuilder !
(! "
args" &
)& '
.' (
Build( -
(- .
). /
./ 0
Run0 3
(3 4
)4 5
;5 6
} 
catch 
( 
	Exception 
ex 
)  
{ 
Log 
. 
Fatal 
( 
ex 
, 
$str ;
); <
;< =
}   
finally!! 
{"" 
Log## 
.## 
CloseAndFlush## !
(##! "
)##" #
;### $
}$$ 
}%% 	
public'' 
static'' 
IHostBuilder'' "
CreateHostBuilder''# 4
(''4 5
string''5 ;
[''; <
]''< =
args''> B
)''B C
=>''D F
Host(( 
.((  
CreateDefaultBuilder(( %
(((% &
args((& *
)((* +
.)) 

UseSerilog)) #
())# $
)))$ %
.** $
ConfigureWebHostDefaults** )
(**) *

webBuilder*** 4
=>**5 7
{++ 

webBuilder,, 
.,, 

UseStartup,, )
<,,) *
Startup,,* 1
>,,1 2
(,,2 3
),,3 4
;,,4 5
}11 
)11 
;11 
}22 
}33 Ÿ
QD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\DynamicMessageService.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
{ 
public 

class !
DynamicMessageService &
:' ("
IDynamicMessageService) ?
{ 
private 
readonly 
IMongoCollection )
<) *
DynamicMessage* 8
>8 9
_dynamicMessages: J
;J K
private 
readonly 
MongoCollections )
_mongoCollections* ;
;; <
private 
readonly 
IMongoDBContext (
_mongoDBContext) 8
;8 9
public !
DynamicMessageService $
($ %
IOptions% -
<- .
MongoDBConfig. ;
>; <
mongoDBConfig= J
,J K
IMongoDBContextL [
mongoDBContext\ j
)j k
{ 	
_mongoDBContext 
= 
mongoDBContext ,
;, -
_mongoCollections 
= 
mongoDBConfig  -
.- .
Value. 3
.3 4
MongoCollections4 D
;D E
var 
	dbContext 
= 
_mongoDBContext +
.+ ,
GetDBContext, 8
(8 9
)9 :
;: ;
_dynamicMessages 
= 
	dbContext (
.( )
GetCollection) 6
<6 7
DynamicMessage7 E
>E F
(F G
_mongoCollectionsG X
.X Y(
DynamicMessageCollectionNameY u
)u v
;v w
} 	
public!! 
async!! 
Task!! 
<!! 
DynamicMessage!! (
>!!( )
Get!!* -
(!!- .
string!!. 4

messageKey!!5 ?
)!!? @
=>!!A C
await"" 
_dynamicMessages"" %
.""% &
Find""& *
(""* +
x""+ ,
=>""- /
x""0 1
.""1 2

messageKey""2 <
==""= ?

messageKey""@ J
&&""K M
x""N O
.""O P
	isDeleted""P Y
==""Z \
false""] b
)""b c
.""c d
FirstOrDefaultAsync""d w
(""w x
)""x y
??""z |
new	""} Ä
DynamicMessage
""Å è
{
""ê ë
messageType
""í ù
=
""û ü
$str
""† ß
,
""ß ®
message
""© ∞
=
""± ≤
ConstantHelper
""≥ ¡
.
""¡ ¬&
MONGODB_CONNECTION_ERROR
""¬ ⁄
}
""€ ‹
;
""‹ ›
}$$ 
}%% å0
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\HttpsResponseRepository.cs
	namespace

 	
FJT


 
.

 
ReportDesigner

 
.

 

Repository

 '
{ 
public 

class #
HttpsResponseRepository (
:) *$
IHttpsResponseRepository+ C
{ 
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
public #
HttpsResponseRepository &
(& '"
IDynamicMessageService' =!
dynamicMessageService> S
)S T
{ 	"
_dynamicMessageService "
=# $!
dynamicMessageService% :
;: ;
} 	
public 
OkObjectResult 
ReturnResult *
(* +
APIStatusCode+ 8
apiStatusCode9 F
,F G
APIStateH P
apiStateQ Y
,Y Z
object[ a
Datab f
,f g
UserMessageh s
userMessaget 
)	 Ä
{ 	
ApiResponse 
response  
=! "
new# &
ApiResponse' 2
(2 3
)3 4
{ 
apiStatusCode 
= 
apiStatusCode  -
,- .
status 
= 
apiState !
.! "
GetDisplayValue" 1
(1 2
)2 3
,3 4
data 
= 
Data 
, 
userMessage 
= 
userMessage )
} 
; 
return 
new 
OkObjectResult %
(% &
response& .
). /
;/ 0
} 	
public   
async   
Task   
<   
OkObjectResult   (
>  ( )#
ReturnExceptionResponse  * A
(  A B
	Exception  B K
e  L M
)  M N
{!! 	
var"" 
somethingWrongMSG"" !
=""" #
await""$ )"
_dynamicMessageService""* @
.""@ A
Get""A D
(""D E
SOMTHING_WRONG""E S
)""S T
;""T U
ApiResponse## 
response##  
=##! "
new### &
ApiResponse##' 2
(##2 3
)##3 4
{$$ 
apiStatusCode%% 
=%% 
APIStatusCode%%  -
.%%- .
ERROR%%. 3
,%%3 4
status&& 
=&& 
APIState&& !
.&&! "
FAILED&&" (
.&&( )
GetDisplayValue&&) 8
(&&8 9
)&&9 :
,&&: ;
userMessage'' 
='' 
new'' !
UserMessage''" -
{''. /
messageContent''0 >
=''? @
new''A D
MessageContent''E S
{''T U
messageType''V a
=''b c
somethingWrongMSG''d u
.''u v
messageType	''v Å
,
''Å Ç
messageCode
''É é
=
''è ê
somethingWrongMSG
''ë ¢
.
''¢ £
messageCode
''£ Æ
,
''Æ Ø
message
''∞ ∑
=
''∏ π
somethingWrongMSG
''∫ À
.
''À Ã
message
''Ã ”
,
''” ‘
err
''’ ÿ
=
''Ÿ ⁄
new
''€ ﬁ
ErrorVM
''ﬂ Ê
{
''Á Ë
message
''È 
=
''Ò Ú
e
''Û Ù
.
''Ù ı
Message
''ı ¸
,
''¸ ˝
stack
''˛ É
=
''Ñ Ö
e
''Ü á
.
''á à

StackTrace
''à í
}
''ì î
}
''ï ñ
}
''ó ò
}(( 
;(( 
return)) 
new)) 
OkObjectResult)) %
())% &
response))& .
))). /
;))/ 0
}** 	
}++ 
public-- 

class-- 
ApiResponse-- 
{.. 
public// 
APIStatusCode// 
apiStatusCode// *
{//+ ,
get//- 0
;//0 1
set//2 5
;//5 6
}//7 8
public00 
string00 
status00 
{00 
get00 "
;00" #
set00$ '
;00' (
}00) *
public11 
UserMessage11 
userMessage11 &
{11' (
get11) ,
;11, -
set11. 1
;111 2
}113 4
public22 
object22 
data22 
{22 
get22  
;22  !
set22" %
;22% &
}22' (
}33 
public55 

class55 
UserMessage55 
{66 
public77 
string77 
message77 
{77 
get77  #
;77# $
set77% (
;77( )
}77* +
public88 
MessageContent88 
messageContent88 ,
{88- .
get88/ 2
;882 3
set884 7
;887 8
}889 :
}99 
public;; 

class;; 
MessageContent;; 
{<< 
public== 
string== 
message== 
{== 
get==  #
;==# $
set==% (
;==( )
}==* +
public>> 
string>> 
messageCode>> !
{>>" #
get>>$ '
;>>' (
set>>) ,
;>>, -
}>>. /
public?? 
string?? 
messageType?? !
{??" #
get??$ '
;??' (
set??) ,
;??, -
}??. /
public@@ 
ErrorVM@@ 
err@@ 
{@@ 
get@@  
;@@  !
set@@" %
;@@% &
}@@' (
}AA 
publicCC 

classCC 
ErrorVMCC 
{DD 
publicEE 
stringEE 
messageEE 
{EE 
getEE  #
;EE# $
setEE% (
;EE( )
}EE* +
publicFF 
stringFF 
stackFF 
{FF 
getFF !
;FF! "
setFF# &
;FF& '
}FF( )
}GG 
}HH Õ
\D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IDynamicMessageService.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 "
IDynamicMessageService		 +
{

 
public 
Task 
< 
DynamicMessage !
>! "
Get# &
(& '
string' -

messageKey. 8
)8 9
;9 :
} 
} ë
^D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IHttpsResponseRepository.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
{		 
public

 

	interface

 $
IHttpsResponseRepository

 -
{ 
OkObjectResult 
ReturnResult #
(# $
APIStatusCode$ 1
apiStatusCode2 ?
,? @
APIStateA I
apiStateJ R
,R S
objectT Z
Data[ _
,_ `
UserMessagea l
Messagem t
)t u
;u v
Task 
< 
OkObjectResult 
> #
ReturnExceptionResponse 4
(4 5
	Exception5 >
e? @
)@ A
;A B
} 
} Ï
UD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IMongoDBContext.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 
IMongoDBContext		 $
{

 
public 
IMongoDatabase 
GetDBContext *
(* +
)+ ,
;, -
} 
} Å
XD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IUtilityController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 
IUtilityController		 '
{

 
public 
ResponseModel #
CheckStatusOfReportFile 4
(4 5
string5 ;
fileName< D
,D E
boolF J
isEndUserReportK Z
,Z [
string\ b 
reportGenerationTypec w
)w x
;x y
public 
Task 
< 
ResponseModel !
>! "
GetReportByteData# 4
(4 5
string5 ;
fileName< D
,D E
boolF J
isEndUserReportK Z
,Z [
string\ b 
reportGenerationTypec w
)w x
;x y
} 
} ∆

JD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\MongoDBContext.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
{ 
public 

class 
MongoDBContext 
:  !
IMongoDBContext" 1
{ 
private 
readonly 
MongoDBConfig &
_mongoDBConfig' 5
;5 6
public 
MongoDBContext 
( 
IOptions &
<& '
MongoDBConfig' 4
>4 5
mongoDBConfig6 C
)C D
{ 	
_mongoDBConfig 
= 
mongoDBConfig *
.* +
Value+ 0
;0 1
} 	
public 
IMongoDatabase 
GetDBContext *
(* +
)+ ,
{ 	
var 
client 
= 
new 
MongoClient (
(( )
_mongoDBConfig) 7
.7 8#
MongoDBConnectionString8 O
)O P
;P Q
return 
client 
. 
GetDatabase %
(% &
_mongoDBConfig& 4
.4 5
DBName5 ;
); <
;< =
} 	
} 
} ûä
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\UtilityController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
{ 
public 

class 
UtilityController "
:# $

Controller% /
,/ 0
IUtilityController1 C
{ 
	protected 
readonly 
FJTSqlDBContext *
_FJTSqlDBContext+ ;
;; <
	protected 
ConstantPath 
_constantPath ,
;, -
	protected  
IdentityserverConfig &!
_identityserverConfig' <
;< =
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
private 
readonly 
ILogger  
<  !
UtilityController! 2
>2 3
_logger4 ;
;; <
public 
UtilityController  
(  !
FJTSqlDBContext! 0
fjtSqlDBContext1 @
,@ A
IOptionsB J
<J K
ConstantPathK W
>W X
constantPathY e
,e f
IOptionsg o
<o p!
IdentityserverConfig	p Ñ
>
Ñ Ö"
identityserverConfig
Ü ö
,
ö õ$
IDynamicMessageService
ú ≤#
dynamicMessageService
≥ »
,
» …
ILogger
  —
<
— “
UtilityController
“ „
>
„ ‰
logger
Â Î
)
Î Ï
{ 	
_FJTSqlDBContext   
=   
fjtSqlDBContext   .
;  . /
_constantPath!! 
=!! 
constantPath!! (
.!!( )
Value!!) .
;!!. /!
_identityserverConfig"" !
=""" # 
identityserverConfig""$ 8
.""8 9
Value""9 >
;""> ?"
_dynamicMessageService## "
=### $!
dynamicMessageService##% :
;##: ;
_logger$$ 
=$$ 
logger$$ 
;$$ 
}%% 	
['' 	
	Authorize''	 
('' !
AuthenticationSchemes'' (
='') *
JwtBearerDefaults''+ <
.''< = 
AuthenticationScheme''= Q
)''Q R
]''R S
public(( 
ResponseModel(( #
CheckStatusOfReportFile(( 4
(((4 5
string((5 ;
fileName((< D
,((D E
bool((F J
isEndUserReport((K Z
,((Z [
string((\ b 
reportGenerationType((c w
)((w x
{)) 	
if** 
(** 
fileName** 
==** 
null**  
)**  !
{++ 
var,, 
invalidParameterMSG,, '
=,,( )"
_dynamicMessageService,,* @
.,,@ A
Get,,A D
(,,D E
INVALID_PARAMETER,,E V
),,V W
.,,W X
Result,,X ^
;,,^ _
return-- 
new-- 
ResponseModel-- (
(--( )
)--) *
{--+ ,
	IsSuccess--- 6
=--7 8
false--9 >
,--> ?

StatusCode--@ J
=--K L
(--M N
int--N Q
)--Q R
APIStatusCode--R _
.--_ `
BAD_REQUEST--` k
,--k l
Message--m t
=--u v 
invalidParameterMSG	--w ä
.
--ä ã
message
--ã í
}
--ì î
;
--î ï
}.. 
try// 
{00 
var11 !
isReportFileAvailable11 )
=11* +
false11, 1
;111 2
var22 
reportFolderPath22 $
=22% &
isEndUserReport22' 6
?227 8
_constantPath229 F
.22F G

ReportPath22G Q
:22R S
(22T U 
reportGenerationType22U i
==22j l
(22m n
(22n o
int22o r
)22r s
ReportCategory	22s Å
.
22Å Ç#
SystemGeneratedReport
22Ç ó
)
22ó ò
.
22ò ô
ToString
22ô °
(
22° ¢
)
22¢ £
?
22§ •
_constantPath
22¶ ≥
.
22≥ ¥'
SystemGeneratedReportPath
22¥ Õ
:
22Œ œ
_constantPath
22– ›
.
22› ﬁ 
TemplateReportPath
22ﬁ 
)
22 Ò
;
22Ò Ú
var33 

reportPath33 
=33  
reportFolderPath33! 1
+332 3
fileName334 <
+33= >
ConstantHelper33? M
.33M N
REPORT_EXTENSION33N ^
;33^ _
if55 
(55 
System55 
.55 
IO55 
.55 
File55 "
.55" #
Exists55# )
(55) *

reportPath55* 4
)554 5
)555 6
{66 !
isReportFileAvailable77 )
=77* +
true77, 0
;770 1
}88 
return:: 
new:: 
ResponseModel:: (
(::( )
)::) *
{::+ ,
	IsSuccess::- 6
=::7 8
true::9 =
,::= >
Model::? D
=::E F!
isReportFileAvailable::G \
,::\ ]

StatusCode::^ h
=::i j
(::k l
int::l o
)::o p
APIStatusCode::p }
.::} ~
SUCCESS	::~ Ö
,
::Ö Ü
Message
::á é
=
::è ê
null
::ë ï
}
::ñ ó
;
::ó ò
};; 
catch<< 
(<< 
	Exception<< 
e<< 
)<< 
{== 
_logger>> 
.>> 
LogError>>  
(>>  !
e>>! "
.>>" #
ToString>># +
(>>+ ,
)>>, -
)>>- .
;>>. /
return?? 
new?? 
ResponseModel?? (
(??( )
)??) *
{??+ ,
	IsSuccess??- 6
=??7 8
false??9 >
,??> ?
Model??@ E
=??F G
null??H L
,??L M

StatusCode??N X
=??Y Z
(??[ \
int??\ _
)??_ `
APIStatusCode??` m
.??m n"
INTERNAL_SERVER_ERROR	??n É
,
??É Ñ
Message
??Ö å
=
??ç é
e
??è ê
.
??ê ë
Message
??ë ò
}
??ô ö
;
??ö õ
}@@ 
}AA 	
[CC 	
	AuthorizeCC	 
(CC !
AuthenticationSchemesCC (
=CC) *
JwtBearerDefaultsCC+ <
.CC< = 
AuthenticationSchemeCC= Q
)CCQ R
]CCR S
publicDD 
asyncDD 
TaskDD 
<DD 
ResponseModelDD '
>DD' (
GetReportByteDataDD) :
(DD: ;
stringDD; A
fileNameDDB J
,DDJ K
boolDDL P
isEndUserReportDDQ `
,DD` a
stringDDb h 
reportGenerationTypeDDi }
)DD} ~
{EE 	
ifFF 
(FF 
fileNameFF 
==FF 
nullFF  
)FF  !
{GG 
varHH 
invalidParameterMSGHH '
=HH( )"
_dynamicMessageServiceHH* @
.HH@ A
GetHHA D
(HHD E
INVALID_PARAMETERHHE V
)HHV W
.HHW X
ResultHHX ^
;HH^ _
returnII 
newII 
ResponseModelII (
(II( )
)II) *
{II+ ,
	IsSuccessII- 6
=II7 8
falseII9 >
,II> ?

StatusCodeII@ J
=IIK L
(IIM N
intIIN Q
)IIQ R
APIStatusCodeIIR _
.II_ `
BAD_REQUESTII` k
,IIk l
MessageIIm t
=IIu v 
invalidParameterMSG	IIw ä
.
IIä ã
message
IIã í
}
IIì î
;
IIî ï
}JJ 
tryKK 
{LL 
varMM 
reportFolderPathMM $
=MM% &
isEndUserReportMM' 6
?MM7 8
_constantPathMM9 F
.MMF G

ReportPathMMG Q
:MMR S
(MMT U 
reportGenerationTypeMMU i
==MMj l
(MMm n
(MMn o
intMMo r
)MMr s
ReportCategory	MMs Å
.
MMÅ Ç#
SystemGeneratedReport
MMÇ ó
)
MMó ò
.
MMò ô
ToString
MMô °
(
MM° ¢
)
MM¢ £
?
MM§ •
_constantPath
MM¶ ≥
.
MM≥ ¥'
SystemGeneratedReportPath
MM¥ Õ
:
MMŒ œ
_constantPath
MM– ›
.
MM› ﬁ 
TemplateReportPath
MMﬁ 
)
MM Ò
;
MMÒ Ú
varNN 

reportPathNN 
=NN  
reportFolderPathNN! 1
+NN2 3
fileNameNN4 <
+NN= >
ConstantHelperNN? M
.NNM N
REPORT_EXTENSIONNNN ^
;NN^ _
ReportByteDataVMPP  
reportByteDataVMPP! 1
=PP2 3
newPP4 7
ReportByteDataVMPP8 H
{QQ 
ReportByteDataRR "
=RR# $
awaitRR% *
SystemRR+ 1
.RR1 2
IORR2 4
.RR4 5
FileRR5 9
.RR9 :
ReadAllBytesAsyncRR: K
(RRK L

reportPathRRL V
)RRV W
}SS 
;SS 
varTT "
reportByteDataVMStringTT *
=TT+ ,

NewtonsoftTT- 7
.TT7 8
JsonTT8 <
.TT< =
JsonConvertTT= H
.TTH I
SerializeObjectTTI X
(TTX Y
reportByteDataVMTTY i
)TTi j
;TTj k
returnVV 
newVV 
ResponseModelVV (
(VV( )
)VV) *
{VV+ ,
	IsSuccessVV- 6
=VV7 8
trueVV9 =
,VV= >
ModelVV? D
=VVE F"
reportByteDataVMStringVVG ]
,VV] ^

StatusCodeVV_ i
=VVj k
(VVl m
intVVm p
)VVp q
APIStatusCodeVVq ~
.VV~ 
SUCCESS	VV Ü
,
VVÜ á
Message
VVà è
=
VVê ë
null
VVí ñ
}
VVó ò
;
VVò ô
}WW 
catchXX 
(XX 
	ExceptionXX 
eXX 
)XX 
{YY 
_loggerZZ 
.ZZ 
LogErrorZZ  
(ZZ  !
eZZ! "
.ZZ" #
ToStringZZ# +
(ZZ+ ,
)ZZ, -
)ZZ- .
;ZZ. /
return[[ 
new[[ 
ResponseModel[[ (
([[( )
)[[) *
{[[+ ,
	IsSuccess[[- 6
=[[7 8
false[[9 >
,[[> ?
Model[[@ E
=[[F G
null[[H L
,[[L M

StatusCode[[N X
=[[Y Z
([[[ \
int[[\ _
)[[_ `
APIStatusCode[[` m
.[[m n"
INTERNAL_SERVER_ERROR	[[n É
,
[[É Ñ
Message
[[Ö å
=
[[ç é
e
[[è ê
.
[[ê ë
Message
[[ë ò
}
[[ô ö
;
[[ö õ
}\\ 
}]] 	
public__ 
async__ 
Task__ 
<__ 
double__  
>__  !

RenewToken__" ,
(__, -
)__- .
{`` 	
tryaa 
{bb 
varcc 
authInfocc 
=cc 
awaitcc $
HttpContextcc% 0
.cc0 1
AuthenticateAsynccc1 B
(ccB C!
_identityserverConfigccC X
.ccX Y 
AuthenticationSchemeccY m
)ccm n
;ccn o
ifdd 
(dd 
authInfodd 
==dd 
nulldd  $
)dd$ %
{dd& '
returndd( .
$numdd/ 0
;dd0 1
}dd2 3
varff 
refreshTokenff  
=ff! "
authInfoff# +
.ff+ ,

Propertiesff, 6
.ff6 7
GetTokenValueff7 D
(ffD E
$strffE T
)ffT U
;ffU V
vargg 
accessTokengg 
=gg  !
authInfogg" *
.gg* +

Propertiesgg+ 5
.gg5 6
GetTokenValuegg6 C
(ggC D
$strggD R
)ggR S
;ggS T
ifhh 
(hh 
refreshTokenhh  
==hh! #
nullhh$ (
||hh) +
accessTokenhh, 7
==hh8 :
nullhh; ?
)hh? @
{hhA B
returnhhC I
$numhhJ K
;hhK L
}hhM N
varii 
decodedAccessTokenii &
=ii' (
newii) ,#
JwtSecurityTokenHandlerii- D
(iiD E
)iiE F
.iiF G
ReadJwtTokeniiG S
(iiS T
accessTokeniiT _
)ii_ `
;ii` a
varkk 
nowkk 
=kk 
DateTimekk "
.kk" #
UtcNowkk# )
;kk) *
varll 
timeElapsedll 
=ll  !
nowll" %
.ll% &
Subtractll& .
(ll. /
decodedAccessTokenll/ A
.llA B
PayloadllB I
.llI J
	ValidFromllJ S
)llS T
;llT U
varmm 
timeRemainingmm !
=mm" #
decodedAccessTokenmm$ 6
.mm6 7
Payloadmm7 >
.mm> ?
ValidTomm? F
.mmF G
SubtractmmG O
(mmO P
nowmmP S
)mmS T
;mmT U
varnn 
tokenLifeTimenn !
=nn" #
decodedAccessTokennn$ 6
.nn6 7
Payloadnn7 >
.nn> ?
ValidTonn? F
.nnF G
SubtractnnG O
(nnO P
decodedAccessTokennnP b
.nnb c
Payloadnnc j
.nnj k
	ValidFromnnk t
)nnt u
.nnu v
TotalMilliseconds	nnv á
;
nná à
varoo 
setIntervalTimeoo #
=oo$ %
Mathoo& *
.oo* +
Flooroo+ 0
(oo0 1
tokenLifeTimeoo1 >
/oo? @
$numooA B
)ooB C
;ooC D
ifqq 
(qq 
timeElapsedqq 
>qq  !
timeRemainingqq" /
)qq/ 0
{rr 
HttpClientHandlerss %
handlerss& -
=ss. /
newss0 3
HttpClientHandlerss4 E
{tt 5
)ServerCertificateCustomValidationCallbackuu A
=uuB C
(uuD E
httpRequestMessageuuE W
,uuW X
certuuY ]
,uu] ^
cetChainuu_ g
,uug h
policyErrorsuui u
)uuu v
=>uuw y
{uuz {
return	uu| Ç
true
uuÉ á
;
uuá à
}
uuâ ä
}vv 
;vv 

HttpClientww 
clientww %
=ww& '
Startupww( /
.ww/ 0
islocalhostww0 ;
?ww< =
newww> A

HttpClientwwB L
(wwL M
handlerwwM T
)wwT U
:wwV W
newwwX [

HttpClientww\ f
(wwf g
)wwg h
;wwh i
varyy 
responseyy  
=yy! "
awaityy# (
clientyy) /
.yy/ 0$
RequestRefreshTokenAsyncyy0 H
(yyH I
newyyI L
RefreshTokenRequestyyM `
{zz 
Address{{ 
={{  !
_constantPath{{" /
.{{/ 0
IdentityserverURL{{0 A
+{{B C
ConstantHelper{{D R
.{{R S

TOKEN_PATH{{S ]
,{{] ^
ClientId||  
=||! "!
_identityserverConfig||# 8
.||8 9
ClientId||9 A
,||A B
ClientSecret}} $
=}}% &!
_identityserverConfig}}' <
.}}< =
ClientSecret}}= I
,}}I J
RefreshToken~~ $
=~~% &
refreshToken~~' 3
} 
) 
; 
if
ÅÅ 
(
ÅÅ 
!
ÅÅ 
response
ÅÅ !
.
ÅÅ! "
IsError
ÅÅ" )
)
ÅÅ) *
{
ÇÇ 
authInfo
ÉÉ  
.
ÉÉ  !

Properties
ÉÉ! +
.
ÉÉ+ ,
UpdateTokenValue
ÉÉ, <
(
ÉÉ< =
$str
ÉÉ= K
,
ÉÉK L
response
ÉÉM U
.
ÉÉU V
AccessToken
ÉÉV a
)
ÉÉa b
;
ÉÉb c
authInfo
ÑÑ  
.
ÑÑ  !

Properties
ÑÑ! +
.
ÑÑ+ ,
UpdateTokenValue
ÑÑ, <
(
ÑÑ< =
$str
ÑÑ= L
,
ÑÑL M
response
ÑÑN V
.
ÑÑV W
RefreshToken
ÑÑW c
)
ÑÑc d
;
ÑÑd e
authInfo
ÖÖ  
.
ÖÖ  !

Properties
ÖÖ! +
.
ÖÖ+ ,
UpdateTokenValue
ÖÖ, <
(
ÖÖ< =
$str
ÖÖ= G
,
ÖÖG H
response
ÖÖI Q
.
ÖÖQ R
IdentityToken
ÖÖR _
)
ÖÖ_ `
;
ÖÖ` a
}
ÜÜ 
else
áá 
{
àà 
_logger
ââ 
.
ââ  
LogError
ââ  (
(
ââ( )
$str
ââ) F
+
ââG H
response
ââI Q
.
ââQ R
Error
ââR W
+
ââX Y
$str
ââZ ^
+
ââ_ `
response
ââa i
.
ââi j
ErrorDescription
ââj z
)
ââz {
;
ââ{ |
}
ää 
return
ãã 
response
ãã #
.
ãã# $
IsError
ãã$ +
?
ãã, -
$num
ãã. /
:
ãã0 1
setIntervalTime
ãã2 A
;
ããA B
}
åå 
return
çç 
setIntervalTime
çç &
;
çç& '
}
éé 
catch
èè 
(
èè 
	Exception
èè 
e
èè 
)
èè 
{
êê 
_logger
ëë 
.
ëë 
LogError
ëë  
(
ëë  !
e
ëë! "
.
ëë" #
ToString
ëë# +
(
ëë+ ,
)
ëë, -
)
ëë- .
;
ëë. /
return
íí 
$num
íí 
;
íí 
}
ìì 
}
îî 	
}
ïï 
}ññ Ëá
8D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Startup.cs
	namespace 	
FJT
 
. 
ReportDesigner 
{ 
public 

class 
Startup 
{ 
public 
Startup 
( 
IConfiguration %
configuration& 3
)3 4
{ 	
Configuration 
= 
configuration )
;) *$
IdentityModelEventSource $
.$ %
ShowPII% ,
=- .
true/ 3
;3 4
} 	
public 
IConfiguration 
Configuration +
{, -
get. 1
;1 2
}3 4
public   
static   
string   
IdentityServerURL   .
{  / 0
get  1 4
;  4 5
set  6 9
;  9 :
}  ; <
public!! 
static!! 
bool!! 
IsDevelopmentMode!! ,
{!!- .
get!!/ 2
;!!2 3
set!!4 7
;!!7 8
}!!9 :
public"" 
static"" 
bool"" 
islocalhost"" &
{""' (
get"") ,
;"", -
set"". 1
;""1 2
}""3 4
public## 
static## 
string## 
ClientId## %
{##& '
get##( +
;##+ ,
set##- 0
;##0 1
}##2 3
public&& 
void&& 
ConfigureServices&& %
(&&% &
IServiceCollection&&& 8
services&&9 A
)&&A B
{'' 	
var(( 
constantPath(( 
=(( 
Configuration(( ,
.((, -

GetSection((- 7
(((7 8
nameof((8 >
(((> ?
ConstantPath((? K
)((K L
)((L M
;((M N
var))  
identityserverConfig)) $
=))% &
Configuration))' 4
.))4 5

GetSection))5 ?
())? @
$str))@ V
)))V W
;))W X
Startup** 
.** 
IdentityServerURL** %
=**& '
constantPath**( 4
.**4 5
GetValue**5 =
(**= >
typeof**> D
(**D E
string**E K
)**K L
,**L M
$str**N a
)**a b
.**b c
ToString**c k
(**k l
)**l m
;**m n
Startup++ 
.++ 
IsDevelopmentMode++ %
=++& '
(++( )
bool++) -
)++- .
Configuration++. ;
.++; <
GetValue++< D
(++D E
typeof++E K
(++K L
bool++L P
)++P Q
,++Q R
$str++S f
)++f g
;++g h
Startup,, 
.,, 
ClientId,, 
=,,  
identityserverConfig,, 3
.,,3 4
GetValue,,4 <
(,,< =
typeof,,= C
(,,C D
string,,D J
),,J K
,,,K L
$str,,M W
),,W X
.,,X Y
ToString,,Y a
(,,a b
),,b c
;,,c d
services.. 
... 
AddCors.. 
(.. 
options.. $
=>..% '
{// 
options00 
.00 
	AddPolicy00 %
(00% &
$str00& 2
,002 3
builder11 
=>11  "
builder11# *
.11* +
AllowAnyOrigin11+ 9
(119 :
)11: ;
.22 
AllowAnyMethod22 +
(22+ ,
)22, -
.33 
AllowAnyHeader33 +
(33+ ,
)33, -
)33- .
;33. /
}44 
)44 
;44 
services55 
.55 #
AddControllersWithViews55 ,
(55, -
)55- .
;55. /
string77 
mySqlConnectionStr77 %
=77& '
Configuration77( 5
.775 6
GetConnectionString776 I
(77I J
$str77J ]
)77] ^
;77^ _
services88 
.88 
AddDbContextPool88 %
<88% &
FJTSqlDBContext88& 5
>885 6
(886 7
options887 >
=>88? A
options88B I
.88I J
UseMySql88J R
(88R S
mySqlConnectionStr88S e
,88e f
ServerVersion88g t
.88t u

AutoDetect88u 
(	88 Ä 
mySqlConnectionStr
88Ä í
)
88í ì
)
88ì î
)
88î ï
;
88ï ñ
services:: 
.:: %
AddDistributedMemoryCache:: .
(::. /
)::/ 0
;::0 1
services;; 
.;; 

AddSession;; 
(;;  
options;;  '
=>;;( *
{<< 
options== 
.== 
IdleTimeout== #
===$ %
TimeSpan==& .
.==. /
FromMinutes==/ :
(==: ;
$num==; <
)==< =
;=== >
}>> 
)>> 
;>> 
servicesAA 
.AA 
	ConfigureAA 
<AA 
MongoDBConfigAA ,
>AA, -
(AA- .
ConfigurationAA. ;
.AA; <

GetSectionAA< F
(AAF G
nameofAAG M
(AAM N
MongoDBConfigAAN [
)AA[ \
)AA\ ]
)AA] ^
;AA^ _
servicesBB 
.BB 
	ConfigureBB 
<BB 
ConnectionStringsBB 0
>BB0 1
(BB1 2
ConfigurationBB2 ?
.BB? @

GetSectionBB@ J
(BBJ K
nameofBBK Q
(BBQ R
ConnectionStringsBBR c
)BBc d
)BBd e
)BBe f
;BBf g
servicesCC 
.CC 
	ConfigureCC 
<CC 
ConstantPathCC +
>CC+ ,
(CC, -
ConfigurationCC- :
.CC: ;

GetSectionCC; E
(CCE F
nameofCCF L
(CCL M
ConstantPathCCM Y
)CCY Z
)CCZ [
)CC[ \
;CC\ ]
servicesDD 
.DD 
	ConfigureDD 
<DD  
IdentityserverConfigDD 3
>DD3 4
(DD4 5
ConfigurationDD5 B
.DDB C

GetSectionDDC M
(DDM N
nameofDDN T
(DDT U 
IdentityserverConfigDDU i
)DDi j
)DDj k
)DDk l
;DDl m
servicesGG 
.GG 
	AddScopedGG 
<GG 
IMongoDBContextGG .
,GG. /
MongoDBContextGG0 >
>GG> ?
(GG? @
)GG@ A
;GGA B
servicesHH 
.HH 
	AddScopedHH 
<HH "
IDynamicMessageServiceHH 5
,HH5 6!
DynamicMessageServiceHH7 L
>HHL M
(HHM N
)HHN O
;HHO P
servicesII 
.II 
	AddScopedII 
<II 
IUtilityControllerII 1
,II1 2
UtilityControllerII3 D
>IID E
(IIE F
)IIF G
;IIG H
servicesJJ 
.JJ 
	AddScopedJJ 
<JJ $
IHttpsResponseRepositoryJJ 7
,JJ7 8#
HttpsResponseRepositoryJJ9 P
>JJP Q
(JJQ R
)JJR S
;JJS T
StartupNN 
.NN 
islocalhostNN 
=NN  !
(NN" #
boolNN# '
)NN' (
ConfigurationNN( 5
.NN5 6
GetValueNN6 >
(NN> ?
typeofNN? E
(NNE F
boolNNF J
)NNJ K
,NNK L
$strNNM Z
)NNZ [
;NN[ \
servicesOO 
.OO 
AddAuthenticationOO &
(OO& '
$strOO' /
)OO/ 0
.PP 
AddJwtBearerPP 
(PP 
$strPP &
,PP& '
optionsPP( /
=>PP0 2
{QQ 
ifRR 
(RR 
islocalhostRR #
)RR# $
{SS 
optionsTT 
.TT  "
BackchannelHttpHandlerTT  6
=TT7 8
newTT9 <
HttpClientHandlerTT= N
{TTO P5
)ServerCertificateCustomValidationCallbackTTQ z
=TT{ |
delegate	TT} Ö
{
TTÜ á
return
TTà é
true
TTè ì
;
TTì î
}
TTï ñ
}
TTó ò
;
TTò ô
}UU 
optionsVV 
.VV 
	AuthorityVV %
=VV& '
constantPathVV( 4
.VV4 5
GetValueVV5 =
(VV= >
typeofVV> D
(VVD E
stringVVE K
)VVK L
,VVL M
$strVVN a
)VVa b
.VVb c
ToStringVVc k
(VVk l
)VVl m
;VVm n
optionsWW 
.WW %
TokenValidationParametersWW 5
=WW6 7
newWW8 ;%
TokenValidationParametersWW< U
{XX 
ValidateAudienceYY (
=YY) *
falseYY+ 0
}ZZ 
;ZZ 
}[[ 
)[[ 
;[[ 
var]]  
authenticationScheme]] $
=]]% & 
identityserverConfig]]' ;
.]]; <
GetValue]]< D
(]]D E
typeof]]E K
(]]K L
string]]L R
)]]R S
,]]S T
$str]]U k
)]]k l
.]]l m
ToString]]m u
(]]u v
)]]v w
;]]w x
services^^ 
.^^ 
AddAuthentication^^ &
(^^& '
options^^' .
=>^^/ 1
{__ 
options`` 
.`` 
DefaultScheme`` %
=``& ' 
authenticationScheme``( <
;``< =
optionsaa 
.aa "
DefaultChallengeSchemeaa .
=aa/ 0
ConstantHelperaa1 ?
.aa? @3
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEMEaa@ g
;aag h
}cc 
)cc 
.cc 
	AddCookiecc 
(cc  
authenticationSchemecc -
,cc- .
optionscc/ 6
=>cc7 9
{dd 
optionsee 
.ee 
ExpireTimeSpanee &
=ee' (
TimeSpanee) 1
.ee1 2
FromDaysee2 :
(ee: ;
$numee; =
)ee= >
;ee> ?
optionsff 
.ff 
SlidingExpirationff )
=ff* +
trueff, 0
;ff0 1
optionsgg 
.gg 
SessionStoregg $
=gg% &
newgg' *"
MemoryCacheTicketStoregg+ A
(ggA B
)ggB C
;ggC D
}hh 
)hh 
.ii 
AddOpenIdConnectii 
(ii  
ConstantHelperii  .
.ii. /3
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEMEii/ V
,iiV W
optionsiiX _
=>ii` b
{jj 
ifkk 
(kk 
islocalhostkk !
)kk! "
{ll 
optionsmm 
.mm "
BackchannelHttpHandlermm 4
=mm5 6
newmm7 :
HttpClientHandlermm; L
{mmM N5
)ServerCertificateCustomValidationCallbackmmO x
=mmy z
delegate	mm{ É
{
mmÑ Ö
return
mmÜ å
true
mmç ë
;
mmë í
}
mmì î
}
mmï ñ
;
mmñ ó
}nn 
optionsoo 
.oo 
	Authorityoo #
=oo$ %
constantPathoo& 2
.oo2 3
GetValueoo3 ;
(oo; <
typeofoo< B
(ooB C
stringooC I
)ooI J
,ooJ K
$strooL _
)oo_ `
.oo` a
ToStringooa i
(ooi j
)ooj k
;ook l
optionspp 
.pp 
ClientIdpp "
=pp# $ 
identityserverConfigpp% 9
.pp9 :
GetValuepp: B
(ppB C
typeofppC I
(ppI J
stringppJ P
)ppP Q
,ppQ R
$strppS ]
)pp] ^
.pp^ _
ToStringpp_ g
(ppg h
)pph i
;ppi j
optionsqq 
.qq 
ClientSecretqq &
=qq' ( 
identityserverConfigqq) =
.qq= >
GetValueqq> F
(qqF G
typeofqqG M
(qqM N
stringqqN T
)qqT U
,qqU V
$strqqW e
)qqe f
.qqf g
ToStringqqg o
(qqo p
)qqp q
;qqq r
optionsss 
.ss 
ResponseTypess &
=ss' (
$strss) /
;ss/ 0
optionstt 
.tt 
UsePkcett !
=tt" #
truett$ (
;tt( )
optionsvv 
.vv 
CallbackPathvv &
=vv' (
$strvv) :
;vv: ;
optionsww 
.ww 
Scopeww 
.ww  
Addww  #
(ww# $
$strww$ ,
)ww, -
;ww- .
optionsxx 
.xx 
Scopexx 
.xx  
Addxx  #
(xx# $
$strxx$ -
)xx- .
;xx. /
optionsyy 
.yy 
Scopeyy 
.yy  
Addyy  #
(yy# $
$stryy$ 7
)yy7 8
;yy8 9
optionszz 
.zz 
Scopezz 
.zz  
Addzz  #
(zz# $
$strzz$ 7
)zz7 8
;zz8 9
options{{ 
.{{ 
Scope{{ 
.{{  
Add{{  #
({{# $
$str{{$ 4
){{4 5
;{{5 6
options|| 
.|| !
SignedOutCallbackPath|| /
=||0 1
$str||2 >
;||> ?
options}} 
.}} 

SaveTokens}} $
=}}% &
true}}' +
;}}+ ,
options~~ 
.~~ 
Events~~  
=~~! "
new~~# &
OpenIdConnectEvents~~' :
{ 
OnTokenValidated
ÉÉ &
=
ÉÉ' (
x
ÉÉ) *
=>
ÉÉ+ -
{
ÑÑ 
var
ÜÜ 
identity
ÜÜ &
=
ÜÜ' (
(
ÜÜ) *
ClaimsIdentity
ÜÜ* 8
)
ÜÜ8 9
x
ÜÜ9 :
.
ÜÜ: ;
	Principal
ÜÜ; D
.
ÜÜD E
Identity
ÜÜE M
;
ÜÜM N
identity
áá "
.
áá" #
	AddClaims
áá# ,
(
áá, -
new
áá- 0
[
áá0 1
]
áá1 2
{
àà 
new
ââ  #
Claim
ââ$ )
(
ââ) *
$str
ââ* 8
,
ââ8 9
x
ââ: ;
.
ââ; <#
TokenEndpointResponse
ââ< Q
.
ââQ R
AccessToken
ââR ]
)
ââ] ^
,
ââ^ _
new
ää  #
Claim
ää$ )
(
ää) *
$str
ää* 9
,
ää9 :
x
ää; <
.
ää< =#
TokenEndpointResponse
ää= R
.
ääR S
RefreshToken
ääS _
)
ää_ `
}
ãã 
)
ãã 
;
ãã 
x
éé 
.
éé 

Properties
éé &
.
éé& '
IsPersistent
éé' 3
=
éé4 5
true
éé6 :
;
éé: ;
return
èè  
Task
èè! %
.
èè% &
CompletedTask
èè& 3
;
èè3 4
}
êê 
}
ëë 
;
ëë 
}
íí 
)
íí 
;
íí 
}
îî 	
public
óó 
void
óó 
	Configure
óó 
(
óó !
IApplicationBuilder
óó 1
app
óó2 5
,
óó5 6!
IWebHostEnvironment
óó7 J
env
óóK N
)
óóN O
{
òò 	
app
ôô 
.
ôô 
UseCors
ôô 
(
ôô 
$str
ôô $
)
ôô$ %
;
ôô% &
if
öö 
(
öö 
env
öö 
.
öö 
IsDevelopment
öö !
(
öö! "
)
öö" #
)
öö# $
{
õõ 
app
úú 
.
úú '
UseDeveloperExceptionPage
úú -
(
úú- .
)
úú. /
;
úú/ 0
}
ùù 
else
ûû 
{
üü 
app
†† 
.
†† !
UseExceptionHandler
†† '
(
††' (
$str
††( 9
)
††9 :
;
††: ;
app
¢¢ 
.
¢¢ 
UseHsts
¢¢ 
(
¢¢ 
)
¢¢ 
;
¢¢ 
}
££ 
app
§§ 
.
§§ !
UseHttpsRedirection
§§ #
(
§§# $
)
§§$ %
;
§§% &
app
•• 
.
•• 
UseStaticFiles
•• 
(
•• 
)
••  
;
••  !
app
¶¶ 
.
¶¶ 

UseSession
¶¶ 
(
¶¶ 
)
¶¶ 
;
¶¶ 
app
®® 
.
®® $
UseRequestLocalization
®® &
(
®®& '
)
®®' (
;
®®( )
app
©© 
.
©© 

UseRouting
©© 
(
©© 
)
©© 
;
©© 
app
´´ 
.
´´ 
UseAuthentication
´´ !
(
´´! "
)
´´" #
;
´´# $
app
¨¨ 
.
¨¨ 
UseAuthorization
¨¨  
(
¨¨  !
)
¨¨! "
;
¨¨" #
app
ÆÆ 
.
ÆÆ 
UseEndpoints
ÆÆ 
(
ÆÆ 
	endpoints
ÆÆ &
=>
ÆÆ' )
{
ØØ 
	endpoints
±± 
.
±±  
MapControllerRoute
±± ,
(
±±, -
name
≤≤ 
:
≤≤ 
$str
≤≤ #
,
≤≤# $
pattern
≥≥ 
:
≥≥ 
$str
≥≥ I
)
≥≥I J
;
≥≥J K
}
¥¥ 
)
¥¥ 
;
¥¥ 
}
µµ 	
}
∂∂ 
}∑∑ 