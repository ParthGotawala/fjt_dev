using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;
using System.Web.Configuration;

namespace FJT.Scanner
{

    static class Constants
    {
        public const int MAX_ARRAY_ELEMENTS = 128;
        public const int FILE_PATH_MAX_LENGTH = 256;
    }

    ////////////////////
    //
    // ErrorDefine
    //
    ////////////////////

    //! Error codes.
    public enum ErrorCode
    {
        NoErrors = 0,          //!< Success.

        // General
        OtherFailure = 100,    //!< An error occurred during scanning. Please try your scan again.
        InvalidArgument,       //!< Argument is invalid.
        InvalidOperationProcedure, //!< The operation procedure is incorrect.
        ScanningInProgress,    //!< Other operations can not be performed because scanning is in progress.
        NotFoundDevice,        //!< Device is not found.
        InvalidParameters,     //!< Scan parameter is invalid. Please check the reference. 
        NoDeviceResponse,      //!< It's failed to connect to the device.

        // DeviceError
        OtherDeviceError = 200,    //!< Other device error.
        PaperJam,              //!< A document is jammed in the ADF.
        PaperDoubleFeed,       //!< Multifeed Detected.
        CoverOpen,             //!< Cover is open. Close the ADF Cover.
        SecureFunctionLock,    //!< Scan is restricted by Secure Function Lock.
        NoPaper,               //!< No document is set in ADF.
        Busy,                  //!< The device is busy. After the current scanning operation is completed, please try again.
        DeviceMemoryFull,            //!< If the device has some jobs stored in memory please wait until these jobs are completed or delete any remaining jobs and then try again.
        PullScanLock,          //!< Scanning has been restricted from PCs and mobile devices, you may be able to scan from the device.
        InvalidParametersInCurrentDeviceState,    //!< Unacceptable parameters in the current device state.
        OtherPaperFeedError,   //!< Other paper feed error. 

        // SaveImage
        FailedToSave = 300,    //!< Failed to save image.

        // ScanError
        LowMemory = 400,       //!< There is not enough memory in your PC.

        // Path
        PathTooLong = 500,     //!< File path is too long.
    }

    ////////////////////
    //
    // Common
    //
    ////////////////////

    //! Resolution.
    public enum Resolution
    {
        reso100dpi = 0,    //!< 100dpi    
        reso150dpi,        //!< 150dpi
        reso200dpi,        //!< 200dpi
        reso300dpi,        //!< 300dpi
        reso400dpi,        //!< 400dpi
        reso600dpi,        //!< 600dpi
        reso1200dpi,       //!< 1200dpi
        reso2400dpi,       //!< 2400dpi
        reso4800dpi,       //!< 4800dpi
        reso9600dpi,       //!< 9600dpi
        reso19200dpi,      //!< 19200dpi
    };

    //! Paper size.
    public enum PaperType
    {
        AutoSize = 0,  //!< Detect the paper size automatically.
        A3,            //!< A3: 297x420 mm. This is only available A3 supporting models.
        Ledger,        //!< Ledger: 279.4x431.8 mm (11x17 in.). This is only available A3 supporting models.
        JISB4,         //!< JIS B4: 257x364 mm. This is only available A3 supporting models.
        A4,            //!< A4: 210x297 mm
        JISB5,         //!< JIS B5: 182x257 mm
        Letter,        //!< Letter: 215.9x279.4 mm (8.5x11 in.)
        Legal,         //!< Legal:  215.9x355.6 mm (8.5x14 in.)
        A5,            //!< A5: 148x210 mm
        JISB6,         //!< JIS B6: 128x182 mm
        A6,            //!< A6: 105x148 mm
        Executive,     //!< Exective: 184.1x266.7 mm (7.25x10.5 in.)
        Photo,         //!< Photo: 101.6x152.4 mm (4x6 in.)
        IndexCard,     //!< Index Card: 127x203.2 mm (5x8 in.)
        PhotoL,        //!< Photo L: 89x127 mm
        Photo2L,       //!< Photo 2L: 127x178 mm
        Postcard,      //!< Post Card 1: 100x148 mm
        Postcard2,     //!< Post Card 2: 148x200 mm
        BusinessCard90X60, //!< Business Card (Horizontal): 90x60 mm
        BusinessCard60X90, //!< Business Card (Vertical) : 60x90 mm
        Folio,         //!< Folio: 215.9x330.2 mm (8.5x13 in.)
        MexicanLegal,  //!< Mexican Legal: 215.9x339.85 mm (8.5x13.38 in.)
        IndiaLegal,    //!< India Legal: 215x345mm (8.46x13.58 in.)
        LongPaper_NarrowWidth, //!< LongPaper (Narrow width). Width: 107.9 mm (4.25in.), Height: Documentt length.
        LongPaper_NomalWidth,  //!< LongPaper (Normal width). Width: 215.9 mm (8.5in.), Height: Documentt length.
        CustomSize,    //!< Custom size.
    };

    //! Color type.
    public enum ColorType
    {
        AutoColor = 0,     //!< Distinguishes the type of image automatically.
        BlackWhite,        //!< 1bit Monochrome.
        ErrorDiffusion,    //!< 1bit Monochrome (Error diffusion).
        TrueGray,          //!< 8bit gray.
        Color24bit,        //!< 24bit color.
    };

    //! Paper size.
    //! The unit is 1/100 mm. If the value is 1000 it means 10 mm.
    [StructLayout(LayoutKind.Sequential)]
    public struct Size
    {
        public UInt32 x;    //!< Width or sub scanning direction.
        public UInt32 y;    //!< Height or main scanning direction.
    };

    ////////////////////
    //
    // DeviceInfo
    //
    ////////////////////

    //! Interface type.
    public enum InterfaceType
    {
        Usb = 0, //!< USB
        Network  //!< Wired LAN or WLAN
    }

    //! Device information.
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public class DeviceInfo
    {
        public InterfaceType connectionType;          //!< Device connection method.
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public string modelName;    //!< Device name.
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public string nodeName;     //!< Node name. 
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public string ipAddress;    //!< IP address.
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public string macAddress;   //!< MAC address.
    }

    //! List of device information.
    [StructLayout(LayoutKind.Sequential)]
    public class DeviceInfoList
    {
        public IntPtr list;  //!< Array of device information.
        public UInt32 listSize; //!< Number of elements included in the list.
    };

    ////////////////////
    //
    // FileParameter
    //
    ////////////////////

    //! Output file type.
    public enum FileType
    {
        Bmp = 0, //!< Windows bitmap.
        Jpg,     //!< jpeg.
        Png,     //!< png.
        Tiff,    //!< Single tiff when snanning only 1 page, otherwise Multiple tiff for multiple tiff.
        Pdf      //!< Single pdf when snanning only 1 page, otherwise Multiple tiff for multiple pdf.
    };

    //! Compression type for tiff.
    public enum TiffCompressType
    {
        NoCompress,    //!< No compress. It can be used only when **TrueGray** or **Color24bit** is selected as **ColorType**.
        CCITT3,        //!< CCITT3, Group 3 Fax Encoding. It can be used only when **BlackWhite** or **ErrorDiffusion** is selected as **ColorType**.
        CCITT4,        //!< CCITT4, Group 4 Fax Encoding. It can be used only when **BlackWhite** or **ErrorDiffusion** is selected as **ColorType**.
        RLE,           //!< Run Length Encoding, PackBits. It can be used only when **TrueGray** or **Color24bit** is selected as **ColorType**.
        LZW,           //!< LZW.  It can be used only when **TrueGray** or **Color24bit** is selected as **ColorType**.
    };

    //! Output file parameter.
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public class FileParameter
    {
        public FileType fileType;         //!< File format for saving images.
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Constants.FILE_PATH_MAX_LENGTH)]
        public string folderPath; //!< Save folder.
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Constants.FILE_PATH_MAX_LENGTH)]
        public string filePrefix; //!< Prefix of filename.
        public UInt32 quality;          //!< Quality when saving in pdf, jpg format. Value range: 0 to 100.
        public TiffCompressType tiffCompressType;    //!< Compression format when saved in tiff format.
        public UInt32 pageCountPerFile; //!< Currently it can not be used because it's not yet implemented. This parameter is ignored.
    };

    ////////////////////
    //
    // Capability
    //
    ////////////////////

    //! Supported color type. 
    [StructLayout(LayoutKind.Sequential)]
    public struct SupportColorType
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool autoColor;        //!< Distinguishes the type of image automatically.
        [MarshalAs(UnmanagedType.U1)]
        public bool blackAndWhite;    //!< 1bit monochrome
        [MarshalAs(UnmanagedType.U1)]
        public bool errorDiffusion;   //!< 1bit monochrome (Error diffusion).
        [MarshalAs(UnmanagedType.U1)]
        public bool trueGray;         //!< 8bit gray.
        [MarshalAs(UnmanagedType.U1)]
        public bool color24bit;       //!< 24bit color.
    };

    //! The maximum paper size of each paper source.
    [StructLayout(LayoutKind.Sequential)]
    public struct SupportScanSize
    {
        public Size flatbed;  //!< When scanning from a flatbed.
        public Size simplex;  //!< When scanning from ADF with simplex (one side scanning).
        public Size duplex;   //!< When scanning from ADF with duplex (2-sided scanning).
    };

    //! The limitation for long paper mode.
    //! Depending on the resolution, the maximum size may be smaller than this value.
    //! The unit is 1/100 mm. If the value is 1000 it means 10 mm.
    [StructLayout(LayoutKind.Sequential)]
    public struct LongPaper
    {
        public UInt32 maxSimplexLength;   //!< Maximum length for simplex.
        public UInt32 maxDuplexLength;    //!< Maximum length for duplex.
        public UInt32 maxResolution;      //!< Maximum resolution when LongPaper is selected.(There is no limit when this value is 0.)
    };

    //! The margin size when the device reads the document.
    //! The scan result will be smaller by this margin size than the paper type you selected.
    //! The unit is 1/100 mm. If the value is 1000 it means 10 mm.
    [StructLayout(LayoutKind.Sequential)]
    public struct DeviceReadMargin
    {
        public int left;   //!< Margin size of left.
        public int top;    //!< Margin size of top.
        public int right;  //!< Margin size of right.
        public int bottom; //!< Margin size of bottom.
    };

    //! Supported paper source.
    [StructLayout(LayoutKind.Sequential)]
    public struct SupportPaperSource
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool flatbed;  //!< Flatbed
        [MarshalAs(UnmanagedType.U1)]
        public bool adf;      //!< ADF (Automatic Document Feeder)
        [MarshalAs(UnmanagedType.U1)]
        public bool cardslot;    //!< Cardslot
    };

    //! Capability of auto deskew.
    [StructLayout(LayoutKind.Sequential)]
    public struct SupportAutoDeskew
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool support;  //!< Capability.
        public SupportPaperSource paperSource;    //!< Supported paper source. If the document is scanned from an unsupported paper source, Auto Deskew will not work.
    };

    //! Capability of margin settings.
    //! The unit is 1/100 mm. If the value is 1000 it means 10 mm.
    [StructLayout(LayoutKind.Sequential)]
    public struct SupportMarginSettings
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool support;          //!< Capability.
        public int maxMargin;      //!< Maximum value that can adjust the document margin. It is the same value on the left, top, right and bottom.
        public int minMargin;      //!< Minimum value that can adjust the document margin. It is the same value on the left, top, right and bottom.
        [MarshalAs(UnmanagedType.U1)]
        public bool isAutoSizeOnly;   //!< If this is true, Margin Settings will work only if you specify **AutoSize** as **PaperType**.
    };

    //! Capability of continuous scan.
    [StructLayout(LayoutKind.Sequential)]
    public struct SupportContinuousScan
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool support;                  //!< Capability.
        public UInt32 minTimeoutMinutes;    //!< Minimum value of continuous scan timeout period. The unit is minutes.
        public UInt32 maxTimeoutMinutes;    //!< Maximum value of continuous scan timeout period. The unit is minutes.
        public UInt32 minFeedDelaySec;      //!< Minimum time between the time document is set in the feeder and the time feed starts. The unit is seconds.
        public UInt32 maxFeedDelaySec;      //!< Maximum time between the time document is set in the feeder and the time feed starts. The unit is seconds.
    };

    //! Capability of scanner device.
    //! Only functions that value is true can be used for scan parameters.
    [StructLayout(LayoutKind.Sequential)]
    public class Capability
    {
        // Device specification.
        public SupportScanSize maxDocSize;    //!< Maximum size of scannable documents. If you specify over this value as custom size, It will be scanned with this size.
        public SupportScanSize minDocSize;    //!< Minimum size of scannable documents. If you specify under this value as custom size, It will be scanned with this size.
        public LongPaper longPaper;           //!< The maximum paper length and resolution for long paper mode. If you specify **LongPaper** as **PaperType**, you can scan documents up to this length and resolution.
        public UInt32 autoSizeMaxResolution;    //!< Maximum resolution when AutoSize is selected. If you specify **AutoSize** as **PaperType**, you can scan up to this resolution.(There is no limit when this value is 0.)
        public DeviceReadMargin readMargin;   //!< Margin size when the device reads the document.

        // Basic settings.
        public SupportPaperSource paperSource;    //!< Supported paper source.
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public Resolution[] resolutionList; //!< Array of supported resolution.
        public byte resolutionNum;             //!< The number of elements in resolution array.
        public SupportColorType colorType;        //!< Supported color type.
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public PaperType[] paperTypeList;   //!< Array of supported paper type.
        public byte paperTypeNum;              //!< The number of elements in **PaperType** array.
        [MarshalAs(UnmanagedType.U1)]
        public bool brightness;                   //!< Adjust brightness.
        [MarshalAs(UnmanagedType.U1)]
        public bool contrast;                     //!< Adjust contrast.
        [MarshalAs(UnmanagedType.U1)]
        public bool duplex;                       //!< 2-sided scanning.

        // Advanced settings.
        SupportAutoDeskew autoDeskew;  //!< Auto deskew.
        [MarshalAs(UnmanagedType.U1)]
        public bool detectEndOfPage;          //!< Detect end of page.
        SupportMarginSettings marginSettings;  //!< Margin settings.
        [MarshalAs(UnmanagedType.U1)]
        public bool rotateImage;              //!< Rotate image.
        [MarshalAs(UnmanagedType.U1)]
        public bool autoEdgeFill;             //!< Fill the edge automatically.
        [MarshalAs(UnmanagedType.U1)]
        public bool customEdgeFill;           //!< Fill an edge of a specified width.
        [MarshalAs(UnmanagedType.U1)]
        public bool punchHoleRemoval;         //!< Remove punch hole.
        [MarshalAs(UnmanagedType.U1)]
        public bool autoColorDetectAdjust;    //!< Adjust auto color detecting.
        [MarshalAs(UnmanagedType.U1)]
        public bool skipBlankPage;            //!< Skip blank page
        [MarshalAs(UnmanagedType.U1)]
        public bool diffusionAdjustment_Gray; //!< Adjust brightness and contrase when **ErrorDiffusion** is selected as **ColorType**.
        [MarshalAs(UnmanagedType.U1)]
        public bool colorToneAdjustment;      //!< Adjust color tone.
        [MarshalAs(UnmanagedType.U1)]
        public bool backgroundProcessing;     //!< Remove background color and bleed through prevention.
        [MarshalAs(UnmanagedType.U1)]
        public bool colorDrop;                //!< Drop color.
        [MarshalAs(UnmanagedType.U1)]
        public bool edgeEmphasis;             //!< Emphasize the edge.
        [MarshalAs(UnmanagedType.U1)]
        public bool reduceNoise;              //!< Reduce noise.
        [MarshalAs(UnmanagedType.U1)]
        public bool monoThresholdAdjustment;  //!< Adjust monochrome threshold.
        [MarshalAs(UnmanagedType.U1)]
        public bool blurredCharacterCorrection;   //!< Correct blurred character.
        [MarshalAs(UnmanagedType.U1)]
        public bool boldfaceFormatting;       //!< Make bold character.
        [MarshalAs(UnmanagedType.U1)]
        public bool mergeImages;              //!< Merge two images into one. 
        [MarshalAs(UnmanagedType.U1)]
        public bool carrierSheetMode;         //!< Scan with charrier sheet.
        [MarshalAs(UnmanagedType.U1)]
        public bool plasticCardMode;          //!< Scan plastic card.
        [MarshalAs(UnmanagedType.U1)]
        public bool singlePaperScan;           //!< Scan single paper.
        public SupportContinuousScan continuousScan;  //!< Repeat the scan.
        [MarshalAs(UnmanagedType.U1)]
        public bool multifeedDetection;       //!< Detect multifeed.
        [MarshalAs(UnmanagedType.U1)]
        public bool barcodeDetection;         //!< Detect barcode.
        [MarshalAs(UnmanagedType.U1)]
        public bool patchcodeDetection;       //!< Detect patchcode.
    };

    ////////////////////
    //
    // ScanParameter
    //
    ////////////////////

    //! Paper source.
    public enum PaperSourceType
    {
        SourceAuto = 0, //!< If paper is inserted in the ADF or card slot, it will be scanned from there. Otherwise it will be scanned from the flatbed.
        Flatbed,   //!< From the flatbed.
        Adf,       //!< From the ADF (Automatic Document Feeder) or card slot. Whether scanning from ADF or card slot depends on the setting of device.
    };

    //! Duplex type.
    public enum DuplexType
    {
        Simplex = 0,       //!< Scanning only one side.
        DuplexLongBinding, //!< The images to be scanned are viewed in book form, flipping each page from left to right or right to left.
        DuplexShortBinding //!< The images to be scanned are viewed in fanfold paper style, flipping each page up or down.
    };

    //! Degree at which the document is rotated.
    public enum RotateAngle
    {
        Rotate0 = 0,   //!< Not rotate.
        Rotate90,  //!< Rotate 90 degrees clockwise.
        Rotate180, //!< Rotate 180 degrees clockwise.
        Rotate270  //!< Rotate 270 degrees clockwise.
    };

    //! Color when filling the document edge.
    public enum CustomEdgeFillColor
    {
        EdgeFillWhite = 0, //!< Fill with white.
        EdgeFillBlack      //!< Fill with black.
    };

    //! Color when filling punch hole.
    public enum PunchHoleRemovalColor
    {
        PunchHoleRemovalWhite = 0,   //!< Fill punch hole with white.
        PunchHoleRemovalNearbyColor  //!< Fill punch hole with the color surrounding the hole.
    };

    //! Types of background processing.
    public enum SmoothingType
    {
        BleedThroughRemoval = 0, //!< Remove the content on one side of the paper from appearing in the other side of the scanned image.
        BackgroundAndBleedThroughRemoval   //!< Remove the background color of a scanned image.
    };

    //! Drop out color.
    public enum DropColor
    {
        DropColorChromatic = 0,    //!< Delete all colors other than Black.
        DropColorRed,      //!< Delete red.
        DropColorGreen,    //!< Delete green.
        DropColorBlue,     //!< Delete blue.
        DropColorCustom    //!< You can specify color to delete.
    };

    //! Merge type.
    public enum MergeType
    {
        MergeNone = 0, //!< Does not merge.
        MergeFromLeftToRight, //!< Merge with fromt page on the right and the other on the left.
        MergeFromTopToBottom,  //!< Merge with front page on the top and the other on the bottom.
    };

    //! Barcode type.
    public enum BarcodeType
    {
        Code39 = 0,    //!< Code39 (Code3of9)
        ITF,           //!< ITF (I-2/5)
        Code128,       //!< Code128
        GS1_128,       //!< GS1-128 (RSS, UCC/EAN-128)
        Codabar,       //!< Codabar (NW-7, Code2of7)
        UPCA,          //!< UPC-A
        UPCE,          //!< UPC-E
        JAN8,          //!< JAN-8 (EAN-8, GTIN-8)
        JAN13,         //!< JAN13 (EAN-13, GTIN-13)
        QR,            //!< QR code
        DataMatrix,    //!< Data Matrix (Data Code)
        PDF417,        //!< PDF417
        Code93,        //!< Code 93
    };

    //! Patchcode type.
    public enum PatchcodeType
    {
        PatchcodeNone = 0, //!< It is used only as detection result.
        Type1,     //!< Type1
        Type2,     //!< Type2
        Type3,     //!< Type2
        Type4,     //!< Type4
        TypeT,     //!< TypeT
        Type6,     //!< Type6
    };

    //! Scanning area.
    //! The unit is 1/100 mm. If the value is 1000 it means 10 mm.
    [StructLayout(LayoutKind.Sequential)]
    public struct Area
    {
        public UInt32 offsetX;  //!< The x coordinate of the offset.
        public UInt32 offsetY;  //!< The y coordinate of the offset.
        public UInt32 width;    //!< width.
        public UInt32 height;   //!< height.
    };

    //! Structure to specify the level of image processing.
    [StructLayout(LayoutKind.Sequential)]
    public struct ImageProcessing
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        public UInt32 level;    //!< The value range varies depending on the type of image processing.
    };

    //! Document type and scanning area.
    [StructLayout(LayoutKind.Sequential)]
    public struct ScanArea
    {
        public PaperType paperType; //!< Type of document size.
        public Size customSize;     //!< Specify the size of the document when **CustomSize** is selected as **PaperType**. If other **PaperType** is selected, this value is ignored.
        [MarshalAs(UnmanagedType.U1)]
        public bool isSelected;     //!< Limit the scanning area.
        public Area selectedArea;   //!< Specify the scanning area when *isSelected* is true, otherwise this value is ignored.
    };

    //! Parameter of margin settings.
    //! The unit of an integer is 1/100mm. If the value is 100 it means 1 mm.
    [StructLayout(LayoutKind.Sequential)]
    public struct MarginSettings
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        public int left;      //!< Value range: -300 to 300 (= -3 to 3mm)
        public int top;       //!< Value range: -300 to 300 (= -3 to 3mm)
        public int right;     //!< Value range: -300 to 300 (= -3 to 3mm)
        public int bottom;    //!< Value range: -300 to 300 (= -3 to 3mm)
    };

    //! Parameter of edge fill.
    //! The unit of an unsigned integer is 1/100mm. If the value is 100 it means 1 mm.
    [StructLayout(LayoutKind.Sequential)]
    public struct CustomEdgeFill
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        public CustomEdgeFillColor color; //!< You can select the color to fill.
        public UInt32 left;     //!< Value range: 0 to 300 (= 0 to 3mm)
        public UInt32 top;      //!< Value range: 0 to 300 (= 0 to 3mm)
        public UInt32 right;    //!< Value range: 0 to 300 (= 0 to 3mm)
        public UInt32 bottom;   //!< Value range: 0 to 300 (= 0 to 3mm)
    };

    //! Parameter of punch hole removal.
    [StructLayout(LayoutKind.Sequential)]
    public struct PunchHoleRemoval
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        public PunchHoleRemovalColor color; //!< You can select the color to fill.
    };

    //! Parameter of auto color detect adjustment.
    //! This parameter only works when you select **AutoColor** as **ColorType**.
    [StructLayout(LayoutKind.Sequential)]
    public struct AutoColorLevel
    {
        //! When the level is smaller, the tendency will be to detect the image as B&W/TrueGray.
        //! When the level is larger, the tendency will be to detect the image as Color.
        //! Value range: 0 to 10
        public UInt32 monoColorDetectLevel;
        //! When the level is smaller, the tendency will be to detect the image as B&W image.
        //! When the level is larger, the tendency will be to detect the image as TrueGray image.
        //! Value range: 0 to 10
        public UInt32 monoGrayDetectLevel;
    };

    //! Parameter of error diffusion adjustment.
    //! This parameter only works when you select **ErrorDiffusion** as **ColorType**.
    [StructLayout(LayoutKind.Sequential)]
    public struct DiffusionAdjustment
    {
        public int brightness;    //!< brightness. Value range: -50 to 50
        public int contrast;      //!< contrast. Value range: -50 to 50
    };

    //! Parameter of color tone adjustment.
    //! This parameter only works when you select **Color24bit** or **TrueGray** as **ColorType**.
    [StructLayout(LayoutKind.Sequential)]
    public struct ColorTone
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool custom;           //!< If true, The color tone is adjusted to the value set below. If false, automatically sets the color image quality.
        public int brightness;    //!< Adjust the brightness of the image. Value range: -50 to 50
        public int contrast;      //!< The higher the level, the greater the difference in intensity. Bright areas become brighter, dark areas become darker. Value range: -50 to 50
        public UInt32 highlight;    //!< The higher the level, the more intense the dark areas. Value range: 1 to 255
        public UInt32 shadow;       //!< The higher the level, the more intense the bright areas. Value range: 0 to (highlight - 1)
        public UInt32 gamma;        //!< The higher the level, the brighter the intermediate (mid level) areas. The unit is 1/100. Value range: 10 to 1000 (=0.1 to 10)
    };

    //! Parameter of background processing.
    [StructLayout(LayoutKind.Sequential)]
    public struct BackgroundProcessing
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;          //!< If true, it will be executed.
        public SmoothingType type;    //!< Type to remove.
        public int level;         //!< Adjust the level of background color. If **SmoothingTyp** is **BleedThroughRemoval**, this value is ignored. Value range: -50 to 50
    };

    //! Parameter of custom color drop.
    //! Customize a color to delete by inputting individual values for the level of red, green, blue.
    [StructLayout(LayoutKind.Sequential)]
    public struct CustomColorDrop
    {
        public UInt32 redVal;   //!< Set a brightness level for red value of RGB. Value range: 0 to 255
        public UInt32 greenVal; //!< Set a brightness level for green value of RGB. Value range: 0 to 255
        public UInt32 blueVal;  //!< Set a brightness level for green value of RGB. Value range: 0 to 255
                                //! Dropout level
                                //! The maximum value will provide the same result as selecting a chromatic color.
                                //! Selecting a large value provides the result of increasing the number of deleted hues.
                                //! Selecting a lower value limits the hues available for deletion.
                                //! Selecting the lowest number will delete the specific hue selected. 
                                //! Value range: 1 to 180
        public UInt32 level;
        [MarshalAs(UnmanagedType.U1)]
        public bool keepDarkColor;    //!< Leaves darker colors in the scanned data close to black even if the color is included in the customized hue value.
    };

    //! Parameter of color drop.
    [StructLayout(LayoutKind.Sequential)]
    public struct ColorDrop
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        public DropColor color;   //!< Select a color to dropout or specify a custom.
        public CustomColorDrop customColor; //!< If custom, specify RGB and level.
    };

    //! Parameter of continuous scan.
    [StructLayout(LayoutKind.Sequential)]
    public struct ContinuousScan
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        public UInt32 timeoutMinutes;   //!< The time from scan to the end of accepting rescan. Value range: 5 to 30 (minutes).
        public UInt32 feedDelaySec;     //!< The time between the time document is set in the feeder and the time feed starts. Value range: 0 to 5 (seconds).
    };

    //! Parameter of barcode detection. 
    [StructLayout(LayoutKind.Sequential)]
    public struct BarcodeDetection
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        [MarshalAs(UnmanagedType.U1)]
        public bool specifyArea;  //!< Specify detection area. If false, it will be detected in the whole area.
        public Area area;         //!< The area when specifying the detection area. If **specifyArea** is false, this value is ignored.
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public BarcodeType[] types; //!< Type of barcode to be detected.
                                    //! The number of elements in types array.
                                    //! ex.) If you want to detect Code39, Codabar and JAN8, it will be as follows.
                                    //! types[0] = Code39;
                                    //! types[1] = Codabar;
                                    //! types[2] = JAN8;
                                    //! typesNum = 3;
        public byte typesNum;
    };

    //! Parameter of patchcode detection.
    [StructLayout(LayoutKind.Sequential)]
    public struct PatchcodeDetection
    {
        [MarshalAs(UnmanagedType.U1)]
        public bool execute;      //!< If true, it will be executed.
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = Constants.MAX_ARRAY_ELEMENTS)]
        public PatchcodeType[] types;   //!< Type of patchcode to be detected.
        public byte typesNum;  //!< The number of elements in types array. For details, refer to BarcodeDetection structure.
    };

    //! Scan parameter.
    [StructLayout(LayoutKind.Sequential)]
    public class ScanParameter
    {
        //! Source that sets documents.
        public PaperSourceType paperSource;
        //! Set the scanning resolution. Higher resolutions can achieve a finer scanned image, but take more memory and transfer time.
        public Resolution resolution;
        //! Set the color type for scanning.
        public ColorType colorType;
        //! Set the paper size for the document to be scanned. 
        public ScanArea scanArea;
        //! Set the brightness for the document to be scanned. Value range: -50 to 50.
        public int brightness;
        //! Set the contrast for the document to be scanned. Value range: -50 to 50.
        public int contrast;
        //! Both sides of the document can be scanned automatically from the ADF.
        public DuplexType duplex;

        //! Correct the skew of the scanned data.
        [MarshalAs(UnmanagedType.U1)]
        public bool autoDeskew;
        //! Detect end of page and automatically adjusts a size of a page when the length of the document is shorter than paper type selected.
        [MarshalAs(UnmanagedType.U1)]
        public bool detectEndOfPage;
        //! Specify the margin size of each side of the scanned image.
        public MarginSettings marginSettings;
        //! Rotate scanned images to the specified orientation.
        public RotateAngle rotateImageAngle;
        //! Fill the edge of a document with a background color automatically.
        [MarshalAs(UnmanagedType.U1)]
        public bool autoEdgeFill;
        //! Fill the edge of a document with a specified color and area. The higher the numbers the greater the area from the edge will be filled. 
        public CustomEdgeFill customEdgeFill;
        //! Remove punch hole marks from the image.
        public PunchHoleRemoval punchHoleRemoval;
        //! Adjust automatic color selection parameters.
        public AutoColorLevel autoColorDetectAdjust;
        //! Remove blank pages from your scanned image. Value range: 0 to 10.
        public ImageProcessing skipBlankPage;
        //! Adjust brightness and contrast to change the final appearance of the **ErrorDiffusion** image.
        public DiffusionAdjustment diffusionAdjustment_Gray;
        //! Adjust color image properties.
        public ColorTone colorToneAdjustment;
        //! Remove bleed-through/pattern (unwanted data) or background color of documents to reduce noise in the scanned image.
        public BackgroundProcessing backgroundProcessing;
        //! Delete selected colors from scan data.
        public ColorDrop colorDrop;
        //! Improve image clarity. The higher the level, the clearer the image. Value range: 1 to 5.
        public ImageProcessing edgeEmphasis;
        //! Reduce noise of scanned image. When noise appears in a scanned image, or a print of a scanned image, this setting can reduce the noise. 
        [MarshalAs(UnmanagedType.U1)]
        public bool reduceNoise;
        //! Adjust the ratio of black and white in an image. 
        //! The higher the level, the more black on the scanned image. The lower the level, the more white on the scanned image.
        //! This parameter only works when you select **BlackWhite** as **ColorType**. Value range: 1 to 254.
        public ImageProcessing monoThresholdAdjustment;
        //! Sharpen the appearance of blurred characters so they are easier to read. This parameter only works when you select **BlackWhite** as **ColorType**.
        [MarshalAs(UnmanagedType.U1)]
        public bool blurredCharacterCorrection;
        //! Increase text density to make it easier to read. This parameter only works when you select **BlackWhite** as **ColorType**. Value range: 1 to 5.
        public ImageProcessing boldfaceFormatting;
        //! Merge two images into one in order of scanning.
        public MergeType mergeImages;
        //! You can scan the following documents using a Carrier Sheet.
        [MarshalAs(UnmanagedType.U1)]
        public bool carrierSheetMode;
        //! Let you scan plastic cards such as driver's licenses or insurance cards from ADF.
        [MarshalAs(UnmanagedType.U1)]
        public bool plasticCardMode;
        //! Single paper Scan will feed one page at a time from the ADF regardless of the number of pages in the ADF.
        [MarshalAs(UnmanagedType.U1)]
        public bool singlePaperScan;
        //! Repeat the scan. Scanning will resume automatically when you set documents in ADF after scanning.
        //! Repeat until you call AbortScanning() or timeout comes.
        public ContinuousScan continuousScan;
        //! Detect the multifeed of the document by ultrasonic sensor.  
        [MarshalAs(UnmanagedType.U1)]
        public bool multifeedDetection;
        //! Read the barcode content in the scanned document.
        public BarcodeDetection barcodeDetection;
        //! Read the patchcode content in the scanned document.
        public PatchcodeDetection patchcodeDetection;
    };

    ////////////////////
    //
    // ScanStatus
    //
    ////////////////////

    //! Scanning status.
    public enum ScanStatus
    {
        Standby = 0,   //!< Before scan start
        Scanning,      //!< Scanning
        AllEnd,        //!< Scan complete (successed)
        Canceled,      //!< Scan complete (canceled)
        Error          //!< Scan complete (error occurred)
    };

    public class SDKWrapper : IDisposable
    {
        private const string dllname = @".\ScanSDK_C.dll";
        [DllImport(dllname, EntryPoint = "EnumerateScanDeviceWithStructure", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode EnumerateScanDeviceWithStructure_dll([Out] DeviceInfoList scanDeviceList);
        [DllImport(dllname, EntryPoint = "SelectDevice", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode SelectDevice_dll([In] DeviceInfo device);
        [DllImport(dllname, EntryPoint = "CheckDocumentExist", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode CheckDocumentExist_dll([MarshalAs(UnmanagedType.U1)] out bool existDocument);
        [DllImport(dllname, EntryPoint = "GetSelectedDeviceInfo", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode GetSelectedDeviceInfo_dll([Out] DeviceInfo selectedDeviceInfo);
        [DllImport(dllname, EntryPoint = "QueryCapabilities", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode QueryCapabilities_dll([Out] Capability deviceCaps);
        [DllImport(dllname, EntryPoint = "SetScanParameter", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode SetScanParameter_dll([In] ScanParameter scanParameter);
        [DllImport(dllname, EntryPoint = "GetScanParameter", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode GetScanParameter_dll([Out] ScanParameter scanParameter);
        [DllImport(dllname, EntryPoint = "SetFileParameter", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode SetFileParameter_dll([In] FileParameter fileParameter);
        [DllImport(dllname, EntryPoint = "GetFileParameter", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode GetFileParameter_dll([Out] FileParameter fileParameter);
        [DllImport(dllname, EntryPoint = "ScanSync", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode ScanSync_dll();
        [DllImport(dllname, EntryPoint = "ScanAsync", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode ScanAsync_dll();
        [DllImport(dllname, EntryPoint = "AbortScanning", CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.U1)]
        private static extern bool AbortScanning_dll();
        [DllImport(dllname, EntryPoint = "GetFileName", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetFileName_dll([In] UInt32 fileNo);
        [DllImport(dllname, EntryPoint = "GetFileList", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetFileList_dll([Out] out UInt32 size);
        [DllImport(dllname, EntryPoint = "GetScanStatus", CallingConvention = CallingConvention.Cdecl)]
        private static extern ScanStatus GetScanStatus_dll();
        [DllImport(dllname, EntryPoint = "GetScanError", CallingConvention = CallingConvention.Cdecl)]
        private static extern ErrorCode GetScanError_dll();
        [DllImport(dllname, EntryPoint = "GetScannedPageCount", CallingConvention = CallingConvention.Cdecl)]
        private static extern UInt32 GetScannedPageCount_dll();
        [DllImport(dllname, EntryPoint = "GetSavedFileCount", CallingConvention = CallingConvention.Cdecl)]
        private static extern UInt32 GetSavedFileCount_dll();
        [DllImport(dllname, EntryPoint = "Finalyze", CallingConvention = CallingConvention.Cdecl)]
        private static extern void Finalyze_dll();

        public static SDKWrapper CreateInstance()
        {
            return new SDKWrapper();
        }

        public void Dispose()
        {
            Finalyze_dll();
        }

        public DeviceInfo[] EnumerateScanDevice()
        {
            var list = new DeviceInfoList();
            var result = EnumerateScanDeviceWithStructure_dll(list);

            var devices = new DeviceInfo[list.listSize];
            for (int idx = 0; idx < list.listSize; idx++)
            {
                devices[idx] = (DeviceInfo)Marshal.PtrToStructure(list.list + idx * Marshal.SizeOf(typeof(DeviceInfo)), typeof(DeviceInfo));
            }

            return devices;
        }

        public void SelectDevice(DeviceInfo device)
        {
            var result = SelectDevice_dll(device);
            //Console.Write("SelectDevice method");
            //Thread.Sleep(1000);
            CheckResult(result);
            //Console.Write("SelectDevice method after");
        }

        public DeviceInfo GetSelectedDeviceInfo()
        {
            var device = new DeviceInfo();
            var result = GetSelectedDeviceInfo_dll(device);
            CheckResult(result);

            return device;
        }

        public Capability QueryCapabilities()
        {
            var caps = new Capability();
            var result = QueryCapabilities_dll(caps);
            CheckResult(result);

            return caps;
        }

        public bool CheckDocumentExist()
        {
            bool exists = false;
            var result = CheckDocumentExist_dll(out exists);
            CheckResult(result);

            return exists;
        }

        public void SetScanParameter(ScanParameter scanParameter)
        {
            var result = SetScanParameter_dll(scanParameter);
            CheckResult(result);
        }

        public ScanParameter GetScanParameter()
        {
            var parameter = new ScanParameter();
            var result = GetScanParameter_dll(parameter);
            CheckResult(result);

            return parameter;
        }

        public void SetFileParameter(FileParameter fileParameter)
        {
            var result = SetFileParameter_dll(fileParameter);
            CheckResult(result);
        }

        public FileParameter GetFileParameter()
        {
            var parameter = new FileParameter();
            var result = GetFileParameter_dll(parameter);
            CheckResult(result);

            return parameter;
        }

        public void ScanSync()
        {
            var result = ScanSync_dll();
            CheckResult(result);
        }

        public void ScanAsync()
        {
            var result = ScanAsync_dll();
            CheckResult(result);
        }

        public bool AbortScanning()
        {
            return AbortScanning_dll();
        }

        public string GetFileName(UInt32 fileNo)
        {
            var ptr = GetFileName_dll(fileNo);
            var str = Marshal.PtrToStringAnsi(ptr);
            return str;
        }

        public string[] GetFileList()
        {
            UInt32 size = 0;
            var pptr = GetFileList_dll(out size);

            var files = new string[size];
            for (int idx = 0; idx < size; idx++)
            {
                var ptr = Marshal.ReadIntPtr(pptr, idx * Marshal.SizeOf(typeof(IntPtr)));
                files[idx] = Marshal.PtrToStringAnsi(ptr);
            }

            return files;
        }

        public ScanStatus GetScanStatus()
        {
            return GetScanStatus_dll();
        }

        public ErrorCode GetScanError()
        {
            return GetScanError_dll();
        }

        public UInt32 GetScannedPageCount()
        {
            return GetScannedPageCount_dll();
        }

        public UInt32 GetSavedFileCount()
        {
            return GetSavedFileCount_dll();
        }

        private void CheckResult(ErrorCode error)
        {
            //Console.WriteLine("Error Check Result {0}", error);
            string ScanDocuFilePath = WebConfigurationManager.AppSettings["ScanDocuFilePath"].ToString();
            File.AppendAllText(ScanDocuFilePath, string.Format("Check Result: {0} {1}", error, Environment.NewLine));

            if (error != ErrorCode.NoErrors)
            {
                throw new SDKException(error);
            }
        }
    }

    public class SDKException : Exception
    {
        public ErrorCode _error { get; private set; }

        public SDKException(ErrorCode error) : base()
        {
            this._error = error;
        }
    }

    public class ScanDetail
    {
        public string FileName { get; set; }
        public string Error { get; set; }
    }

    public class ScanRequestModel
    {
        public string connectionType { get; set; }
        public string ipAddress { get; set; }
        public string nodename { get; set; }
        public string usbModelName { get; set; }
        public bool skipBlankPage { get; set; }
        public int skipBlankPageLevel { get; set; }
        public bool scanDocument { get; set; }
        public string size { get; set; }
        public string color { get; set; }
        public string resolution { get; set; }
        public string scanSide { get; set; }
        public string filePrefix { get; set; }
        public int refTransID { get; set; }
    }
}
