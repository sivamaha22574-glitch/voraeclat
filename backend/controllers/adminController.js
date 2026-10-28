// @desc    Redirect to the exact React Admin Portal
// @route   GET /admin
export const renderAdminConsole = (req, res) => {
  // Seamlessly redirect to the exact full-featured Admin Portal
  res.redirect('http://localhost:3001/#admin');
};
