using IdentityServer4.EntityFramework.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models
{
    [Table("clientusersmapping")]
    public class ClientUsersMapping
    {
        [Key]
        public int Id { get; set; }
        public string ClientId { get; set; }
        public string UserId { get; set; }      
        
        //[ForeignKey("ClientId")]
        //public Client Clients { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public bool isDeleted { get; set; }
    }
}
