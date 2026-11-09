# Netlify deployment

The contact form uses Netlify Forms, so it has no Web3Forms dependency and needs no access key.

1. Deploy the latest `main` branch. Netlify detects the static form named `contact` during the deploy.
2. In the Netlify dashboard, open **Forms → Form detection** and select **Enable form detection** if it is disabled. Redeploy once after enabling it.
3. To receive emails, open **Forms → Submission notifications → Add notification**, select email, and use an email address that belongs to an active member of the Netlify team.
4. Submit a real test message. Submissions are also visible under **Forms** in the Netlify dashboard.
