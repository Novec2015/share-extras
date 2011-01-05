var pollContainerName = "dataLists"

function getPollsContainer(site)
{
   var poll;
   
   if (site.hasContainer(pollContainerName))
   {
      poll = site.getContainer(pollContainerName);
   }
   else
   {
      poll = site.createContainer(pollContainerName);
   }
   
   if(poll != null)
   {
      if (!poll.isTagScope)
      {
         poll.isTagScope = true;
      }
   }
   
   return poll;
}

function findPoll(nodeRef)
{
    // Locate the poll node
    pollNode = search.findNode(nodeRef);
    // TODO Check the type of the node matches pm:poll
    return pollNode;
}

function findPollByName(siteName, pollName)
{
    var site = siteService.getSite(siteName);
    if (site === null)
    {
        // TODO Throw an exception
        status.setCode(status.STATUS_NOT_FOUND, "Site not found: '" + siteId + "'");
        status.redirect = true;
    }
   
    var pollsContainer = getPollsContainer(site);
    if (pollsContainer === null)
    {
       // TODO Throw an exception
        status.setCode(status.STATUS_BAD_REQUEST, "Poll container not found");
        status.redirect = true;
    }
   
    pollNode = pollsContainer.childByNamePath(pollName);
    return pollNode;
}