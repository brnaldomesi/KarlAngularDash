angular.module('KARL.Filters')
    .filter('Gender', function ()
    {
        return function (gender)
        {
            if (gender == 1)
            {
                return 'Mrs.';
            }
            else if (gender == 2)
            {
                return 'Mr.';
            }
            else
            {
                return 'Unknown';
            }
        }
    });
