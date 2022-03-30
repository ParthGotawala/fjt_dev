using fjt.pricingservice.Helper;
using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;


namespace fjt.pricingservice.Repository
{
    public class genericfilesRepository : Repository<genericfiles>, IgenericfilesRepository
    {
        public genericfilesRepository(UnitOfWork unitOfWork)
           : base(unitOfWork.Context)
        {
        }

        public void savePartPicture(GenericFileDetail gencFile)
        {

            MySqlParameter[] parameters = new MySqlParameter[]
                 {
                     new MySqlParameter("refTransID", gencFile.assyID),
                     new MySqlParameter("fileOwnerType", gencFile.gencFileOwnerType),
                     new MySqlParameter("pIsReturnDetail", true)

                 };

            var procResponse = this.Context.Database.SqlQuery<GenericFilePathStatus>("call Sproc_getRefTransDetailForDocument (@fileOwnerType,@refTransID,@pIsReturnDetail)", parameters).ToList();
            var newPath = procResponse[0].newDocumentPath.Replace("/", "\\");

            string root = ConfigurationManager.AppSettings["PartPictureUploadPath"].ToString() + ConstantHelper.GENERICFILE + "\\" + newPath; //PartPictureUploadPath;
            // If directory does not exist, don't even try   
            if (!Directory.Exists(root))
            {
                //Directory dose not exist
                Directory.CreateDirectory(root);
            }


            var sourcePath = ConfigurationManager.AppSettings["PartPictureUploadPath"].ToString() + ConstantHelper.PICTURESTATION + "\\" + gencFile.gencOriginalName;
            var destinationPath = root + "\\" + gencFile.gencFileName;
            File.Move(sourcePath, destinationPath);
            var newImpagePath = ConstantHelper.BASEPATH + procResponse[0].newDocumentPath + '/' + gencFile.gencFileName;



            string refParentIdQuery = string.Format(@"SELECT gencFolderID FROM generic_folder WHERE roleID LIKE '{0}'", gencFile.roleID);
            int? refParentId = this.Context.Database.SqlQuery<int?>(refParentIdQuery).FirstOrDefault();


            //Checking Folder name
            if (gencFile.folderName != "" && gencFile.folderName != null)
            {
                string exsistFolderNameQuery = string.Format(@"SELECT gencFolderID FROM generic_folder WHERE gencFolderName LIKE '{0}' AND refTransID LIKE {1} AND roleID LIKE {2}", gencFile.folderName, gencFile.assyID, int.Parse(gencFile.roleID));
                int? exsistFolderId = this.Context.Database.SqlQuery<int?>(exsistFolderNameQuery).FirstOrDefault();

                if (exsistFolderId == null)
                {
                    string newFolderNameQuery = string.Format(@"INSERT INTO generic_folder (gencFolderName,refTransID,entityID,gencFileOwnerType,roleID,refParentId,createdBy,updatedBy,isDeleted) 
                                                            VALUES('{0}',{1},-9,'{2}',{3},{4},{5},{6},0)",
                                                                 gencFile.folderName, gencFile.assyID, gencFile.gencFileOwnerType,
                                                                  int.Parse(gencFile.roleID), refParentId, gencFile.createdBy, gencFile.createdBy);

                    this.Context.Database.ExecuteSqlCommand(newFolderNameQuery);

                    string FolderNameQuery = string.Format(@"SELECT gencFolderID FROM generic_folder WHERE gencFolderName LIKE '{0}' AND refTransID LIKE {1} AND roleID LIKE {2}", gencFile.folderName, gencFile.assyID, int.Parse(gencFile.roleID));
                    refParentId = this.Context.Database.SqlQuery<int?>(FolderNameQuery).FirstOrDefault();
                }
                else
                {
                    refParentId = exsistFolderId;
                }

            }



            string insertQuery = string.Format(@"INSERT INTO genericfiles(gencFileName,gencFileOwnerType,fileSize,gencOriginalName,createByRoleId,fileGroupBy,
                                                    genFilePath, gencFileType,isDeleted,createdBy,isDisable,tags,refTransID,entityID,refParentId,updateByRoleId,
                                                    updatedBy,gencFileExtension,isShared) 
                                                  VALUES('{0}','{1}',{2},'{3}',{4},'{5}','{6}','{7}',0,{8},0,'{9}',{10},{14},{11},{12},{13},'{15}',1)",
                                               gencFile.gencFileName, gencFile.gencFileOwnerType, gencFile.fileSize, gencFile.gencOriginalName,
                                               gencFile.createdByRoleId, gencFile.fileGroupBy, newImpagePath, gencFile.documentType,
                                               gencFile.createdBy, gencFile.tags, gencFile.assyID, refParentId,
                                               int.Parse(gencFile.roleID), gencFile.createdBy, gencFile.entityID, gencFile.gencFileExtension
                                               );
            insertQuery = insertQuery.Replace("(,", "(NULL,");
            insertQuery = insertQuery.Replace(",)", ",NULL)");
            insertQuery = insertQuery.Replace(",,,,", ",NULL,NULL,NULL,");
            insertQuery = insertQuery.Replace(",,,", ",NULL,NULL,");
            insertQuery = insertQuery.Replace(",,", ",NULL,");
            insertQuery = insertQuery.Replace(",'',", ",NULL,");
            insertQuery = insertQuery.Replace(",''", ",NULL");
            insertQuery = insertQuery.Replace(",,", ",NULL,");
            this.Context.Database.ExecuteSqlCommand(insertQuery);


        }

    }
}

