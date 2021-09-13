using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace VlsmWebApp.Pages
{
    public class VlsmCalculate : PageModel
    {
         public int firstOctet { get; set; }
        public int secondOctet { get; set; }
        public int thirdOctet { get; set; }
        public int fourthOctet { get; set; }
        public int cidrValue { get; set; }

        public List<int> lans { get; set; }

        public List<int> LanHostList { get; set; }
        public List<int> HostsPerLan { get; set; }
    

        public int[] subnets = { 1, 2, 4, 8, 16, 32, 64, 128, 256 };
        public int[] hosts = { 256, 128, 64, 32, 16, 8, 4, 2, 1 };
        public int[] submask = { 24, 25, 26, 27, 28, 29, 30, 31, 32 };
        public int[] cidrLastOctet = { 0, 128, 192, 224, 240, 248, 252, 254, 255 };
        
        public void OnPost()
        {
            if (ModelState.IsValid)
            {
                firstOctet = int.Parse(Request.Form["first"]);
                secondOctet = int.Parse(Request.Form["second"]);
                thirdOctet = int.Parse(Request.Form["third"]);
                fourthOctet = int.Parse(Request.Form["fourth"]);
                cidrValue = int.Parse(Request.Form["cidrValue"]); 
                
            }
            
        }
        public int AvailableHosts()
        {
            int cidrIndex = Array.IndexOf(submask, cidrValue);
            int totalHosts = hosts[cidrIndex] - 2;
            return totalHosts;
        }

        public string NetworkID()
        {
            int cidrIndex = Array.IndexOf(submask, cidrValue);
            int cidrLastOctec = cidrLastOctet[cidrIndex];
            var cidrBinary = Convert.ToString(cidrLastOctec, 2);
            var fourthOctetBinary = Convert.ToString((int)fourthOctet, 2);
            var result = string.Empty;
            LinkedList<char> fourthOctetList = new LinkedList<char>(fourthOctetBinary);
            LinkedList<char> cidrBinaryList = new LinkedList<char>(cidrBinary);

            var fourthLength = fourthOctetList.Count;
            var cidrLength = cidrBinaryList.Count;



            if (fourthLength < 8)
            {
                while (fourthLength < 8)
                {
                    fourthOctetList.AddFirst('0');
                    fourthLength++;
                }
            }

            if (cidrLength < 8)
            {
                while (cidrLength < 8)
                {
                    cidrBinaryList.AddFirst('0');
                }
            }

            for (int i = 0; i < 8; i++)
            {
                if (fourthOctetList.ElementAt(i) == '0' && cidrBinaryList.ElementAt(i) == '0')
                {
                    result += '0';
                }

                if (fourthOctetList.ElementAt(i) == '1' && cidrBinaryList.ElementAt(i) == '0')
                {
                    result += '0';
                }

                if (fourthOctetList.ElementAt(i) == '0' && cidrBinaryList.ElementAt(i) == '1')
                {
                    result += '0';
                }

                if (fourthOctetList.ElementAt(i) == '1' && cidrBinaryList.ElementAt(i) == '1')
                {
                    result += '1';
                }

            }

            int resultBinary = int.Parse(result);
            return (Convert.ToInt32(resultBinary.ToString(), 2)).ToString();
        }

        public void NumLans()
        {


            for (int i = 0; i < lans.Count; i++)
            {
                LanHostList[i] = lans[i];
            }

            for (int j = 0; j < LanHostList.Count; j++)
            {
                if (LanHostList[j] <= 8)
                {
                    LanHostList[j] += 2;
                }
            }
        }

        public void SetHosts()
        {
            for (int i = 0; i < LanHostList.Count; i++)
            {
                for (int j = 0; j < hosts.Length; j++)
                {
                    if (LanHostList[i] <= hosts[j] && LanHostList[i] >= hosts[j + 1])
                    {
                        HostsPerLan[i] = hosts[j];
                    }
                }
            }
        }
        public void OnGet()
        {
            
        }
    }
}